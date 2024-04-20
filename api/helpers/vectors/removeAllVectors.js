const { Pinecone } = require('@pinecone-database/pinecone');

const removeAllPineconeVectors = async (data) => {
  try {
    console.log('removeAllPineconeVectors helper called....');

    const { namespace } = data;
    const pinecone = new Pinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX);

    await index.namespace(namespace).deleteAll();

    return { hasError: false };
  } catch (error) {
    console.log('error: ', error);
    return { hasError: true, message: 'Internal server Error' };
  }
};

module.exports = {
  removeAllPineconeVectors,
};
