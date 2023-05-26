import * as dotenv from 'dotenv'
dotenv.config()

import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {PineconeStore} from "langchain/vectorstores/pinecone";
import {PineconeClient} from "@pinecone-database/pinecone";
import {RetrievalQAChain} from "langchain/chains";
import {OpenAI} from "langchain/llms/openai";

const OPENAI_MODEL = "text-embedding-ada-002";

async function main(){
    const openAIEmbeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY, modelName: OPENAI_MODEL});

    // Add text files to Pinecone
    const pineconeClient = new PineconeClient();
    await pineconeClient.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT
    });

    const contentFiles = ['../data/beato_SFisOTDzGuE.txt', '../data/beato_xKIC9zbSJoE.txt', '../data/beato_ZavJLr5Otq4.txt'];
    let pineconeStore = await PineconeStore.fromTexts(contentFiles, {}, openAIEmbeddings, {
        pineconeIndex: pineconeClient.Index("beato") });

    // Create a RetrievalQAChain
    const model = new OpenAI({openAIApiKey: process.env.OPENAI_API_KEY, modelName: OPENAI_MODEL});
    const qaChain = RetrievalQAChain.fromLLM(model, pineconeStore.asRetriever());
    const answer = await qaChain.call({
        query: "Describe a unique chord change",
    });

    console.info(`The answer is: ${answer}`);
}

main().then(() => {
    console.log("done");
});``