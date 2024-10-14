const { PINECONE_INDEX } = require('../../../config/constant');

const removeAllPineconeVectors = async (data) => {
  try {
    console.log('removeAllPineconeVectors helper called....');

    const { namespace } = data;

    await PINECONE_INDEX.namespace(namespace).deleteAll();

    return { hasError: false };
  } catch (error) {
    console.log('error: ', error);
    return { hasError: true, message: 'Internal server Error' };
  }
};

module.exports = {
  removeAllPineconeVectors,
};
