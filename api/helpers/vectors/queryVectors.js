// const { OpenAIEmbeddings } = require('@langchain/openai');
// const { PineconeStore } = require('@langchain/pinecone');
// const { Pinecone } = require('@pinecone-database/pinecone');
// const { VECTORS } = require('../../../config/constant');

// const queryVectors = async (data) => {
//   try {
//     console.log('queryVectors called');
//     const { namespace, id, count } = data;
//     console.log('count: ', count);
//     console.log('id: ', id);
//     console.log('namespace: ', namespace);

//     const pinecone = new Pinecone();
//     const index = pinecone.Index(process.env.PINECONE_INDEX);

//     const queryResponse = await index.namespace(namespace).query({
//       topK: count,
//       vector: VECTORS,
//       includeValues: true,
//       includeMetadata: true,
//       filter: {
//         id: { $eq: id },
//       },
//     });
//     console.log('queryResponse: ', queryResponse);

//     if (queryResponse.matches && queryResponse.matches.length > 0) {
//       return {
//         hasError: false,
//         data: queryResponse.matches,
//       };
//     } else {
//       return {
//         hasError: true,
//         message: 'Vectors Not Found',
//       };
//     }
//   } catch (error) {
//     console.log('error: ', error);
//   }
// };

// module.exports = {
//   queryVectors,
// };
