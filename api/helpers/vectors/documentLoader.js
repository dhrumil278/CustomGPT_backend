const {
  VALID_FILES,
  PDF_LOADER,
  RECURSIVE_CHARACTER_TEXT_SPLITTER,
} = require('../../../config/constant');

// const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
// const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
// const { OpenAIEmbeddings } = require('@langchain/openai');
// const { PineconeStore } = require('@langchain/pinecone');
// const { Pinecone } = require('@pinecone-database/pinecone');
const fs = require('fs');

const documentLoader = async (metadata) => {
  try {
    let loader;
    if (metadata.mimetype === VALID_FILES.PDF) {
      loader = new PDF_LOADER(metadata.path);
    } else {
      return {
        hasError: true,
        message: 'Invalid File Type',
      };
    }

    const rawDocs = await loader.load();

    const textSplitter = new RECURSIVE_CHARACTER_TEXT_SPLITTER({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    fs.unlink(metadata.path, (error) => null);

    return {
      hasError: false,
      data: docs,
    };
  } catch (error) {
    console.log('error: ', error);
    return {
      hasError: true,
      error: error,
      message: 'Internal Server Error',
    };
  }
};
module.exports = {
  documentLoader,
};
