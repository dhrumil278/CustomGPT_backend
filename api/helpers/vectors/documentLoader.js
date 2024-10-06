// const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
// const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
// const { VALID_FILES } = require('../../../config/constant');
// const { OpenAIEmbeddings } = require('@langchain/openai');
// const { PineconeStore } = require('@langchain/pinecone');
// const { Pinecone } = require('@pinecone-database/pinecone');
// const fs = require('fs');

// const documentLoader = async (metadata, namespace) => {
//   try {
//     let loader;
//     if (metadata.mimetype === VALID_FILES.PDF) {
//       loader = new PDFLoader(metadata.path);
//     } else {
//       return {
//         hasError: true,
//         message: 'Invalid File Type',
//       };
//     }

//     const rawDocs = await loader.load();

//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 200,
//     });

//     const docs = await textSplitter.splitDocuments(rawDocs);

//     await docs.forEach((doc) => {
//       doc.metadata = { id: metadata.id };
//     });

//     const pinecone = new Pinecone();
//     const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

//     const embeddings = new OpenAIEmbeddings({
//       apiKey: process.env.OPENAI_API_KEY,
//       batchSize: 512,
//       model: 'text-embedding-ada-002',
//     });

//     const storeVectors = await PineconeStore.fromDocuments(docs, embeddings, {
//       pineconeIndex: pineconeIndex,
//       namespace: namespace,
//       textKey: 'text',
//       maxConcurrency: 5,
//     });

//     fs.unlink(metadata.path, (error) => null);

//     return {
//       hasError: false,
//       data: docs,
//     };
//   } catch (error) {
//     console.log('error: ', error);
//     return {
//       hasError: true,
//       error: error,
//       message: 'Internal Server Error',
//     };
//   }
// };
// module.exports = {
//   documentLoader,
// };
