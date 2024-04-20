const storeDocsInVectorDB = async (docs) => {
  console.log('storeDocsInVectorDB called:');
  try {
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      batchSize: 512, // Max is 2048
      modelName: 'text-embedding-ada-002',
    });

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    });
  } catch (error) {
    console.log('error: ', error);
  }
};

module.exports = {
  storeDocsInVectorDB,
};
