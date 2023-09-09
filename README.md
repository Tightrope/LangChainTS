# Developer Notes

## Try
* [Return Source Documents](https://js.langchain.com/docs/modules/chains/popular/vector_db_qa#return-source-documents)
* [VectorStore QA](https://js.langchain.com/docs/modules/chains/popular/vector_db_qa)
* [LangChain TS Starter](https://github.com/domeccleston/langchain-ts-starter/tree/main)
* [OpenAI Node](https://github.com/openai/openai-node)
  * Try one of the examples
  * Use openai 4.0.0 — latest gives `_shims` error


## Environment Variables
The following environment variables are required to run the code:
   * `OPENAI_API_KEY` - OpenAI API Key
   * `PINECONE_API_KEY` - Pinecone API Key
   * `PINECONE_ENVIRONMENT` - See Pinecone.io dashboard

Place the above in a `.env` file in the root of the project.

## Notes
 * To run this code in WebStorm, in the Run/Debug Configurations set node paramaters to:
     ```
     --loader ts-node/esm
     ```
    The above is done to support loading LangChain ESM modules.

* OpenAI `text-embedding-ada-002` outputs [1536 dimensions](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)

## References
* [LangChain Install](https://js.langchain.com/docs/get_started/installation)
  * [Examples](https://github.com/hwchase17/langchainjs/tree/main/examples)
* [LangChain Python QA Tutorial](https://python.langchain.com/docs/use_cases/question_answering/how_to/vector_db_qa)
* [Langchain Tutorial For Typescript and Javascript Developers](https://github.com/mayooear/langchain-js-tutorial)
* [LangChain Tutorials](https://python.langchain.com/en/latest/getting_started/tutorials.html)
* [LangChain Docs](https://js.langchain.com/docs/)
* [QuestionAnswer](https://python.langchain.com/en/latest/use_cases/evaluation/qa_benchmarking_sota.html)
* [LangChain TypeScript Getting Started](https://js.langchain.com/docs/getting-started/install#typescript)
* [Pinecone Chunking Strategies](https://www.pinecone.io/learn/chunking-strategies/)
* [Retrieval QA Chain](https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa)
* [NPM Pinecone Client](https://www.npmjs.com/package/@pinecone-database/pinecone)
* [Pincone NodeJS Client](https://docs.pinecone.io/docs/node-client)
* [Pinecone Namespaces](https://docs.pinecone.io/docs/namespaces)