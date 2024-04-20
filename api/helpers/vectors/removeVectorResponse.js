const { queryVectors } = require('./queryVectors');
const { Pinecone } = require('@pinecone-database/pinecone');

const removeVectorResponse = async (data) => {
  console.log('removeVectorResponse helper called');
  try {
    const { namespace, id } = data;

    const pinecone = new Pinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX);

    let getQueryVectors;
    do {
      getQueryVectors = await queryVectors({
        namespace: namespace,
        id: id,
        count: 100,
      });
      console.log('getQueryVectors: ', getQueryVectors);

      if (getQueryVectors?.data?.length > 0) {
        let vectorIds = [];

        await getQueryVectors.data.forEach((record) => {
          vectorIds.push(record.id);
        });
        console.log('vectorIds: ', vectorIds);

        await index.namespace(botId)._deleteMany({
          ids: vectorIds,
        });
      }
    } while (getQueryVectors?.data?.length > 0);

    return { hasError: false };
  } catch (error) {
    console.log('error: ', error);
  }
};
module.exports = {
  removeVectorResponse,
};
