import * as dotenv from 'dotenv'
dotenv.config()

import {OpenAI} from "langchain/llms/openai";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import * as fs from "fs";
import {HNSWLib} from "langchain/vectorstores/hnswlib";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {RetrievalQAChain} from "langchain/chains";
import {PineconeStore} from "langchain/vectorstores/pinecone";
import {PineconeClient} from "@pinecone-database/pinecone"

const index_name = "test";

async function main(){
    const contentFiles = ['./data/elon_5_rules.txt'];

    const pineconeClient = new PineconeClient();
    await pineconeClient.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT
    });

    const openAIEmbeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY});

    // Create an index named if it does not exist after listing the indices
    const indices = await pineconeClient.listIndexes()
    console.log(`Indices: ${JSON.stringify(indices)}`);

    if(!indices.includes(index_name)){
        await pineconeClient.createIndex( {
            createRequest: {
                name: index_name,
                dimension: 1536
            }
        });
        const pineconeIndex = pineconeClient.Index(index_name);

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 0
        });

        for(const contentFile of contentFiles){
            const content = fs.readFileSync(contentFile, {encoding: "utf-8"});
            const chunkedDocuments = await textSplitter.createDocuments([content], [{url: contentFile}]);
            console.log(`Index document ${contentFile} into Pinecone index ${index_name}`);
            await PineconeStore.fromDocuments(chunkedDocuments, openAIEmbeddings, { pineconeIndex: pineconeIndex });
        }
    }

    // const vectorStore = await initHNSWLibVectorStore(contentFiles);
    const vectorStore = await PineconeStore.fromExistingIndex(openAIEmbeddings, {
        pineconeIndex: pineconeClient.Index(index_name) });

    const model = new OpenAI({openAIApiKey: process.env.OPENAI_API_KEY});
    const qaChain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
        returnSourceDocuments: true
    });
    const query = "What is Elon's third step for success?";
    const answer = await qaChain.call({
        query: query
    });

    console.info(`The answer is: ${JSON.stringify(answer)}`);
}

async function initHNSWLibVectorStore( contentFiles: string[]){
    const openAIEmbeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY});

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 0
    });

    const vectorStore = new HNSWLib(openAIEmbeddings, {
        space: "cosine",
        numDimensions: 1536
    });

    for(const contentFile of contentFiles){
        const content = fs.readFileSync(contentFile, {encoding: "utf-8"});
        const chunkedDocuments= await textSplitter.createDocuments([content], [{url: contentFile}]);
        console.log(`Index document ${contentFile} into HNSWLib Vector Store`);
        await vectorStore.addDocuments(chunkedDocuments);
    }

    return vectorStore;
}

main().then(() => {
    console.log("done");
});