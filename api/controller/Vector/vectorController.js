const { documentLoader } = require('../../helpers/vectors/documentLoader');
const { HTTP_STATUS_CODE, VALIDATOR } = require('../../../config/constant');
const { v4: uuidv4 } = require('uuid');
const Attachments = require('../../model/Attachments');
const ChatBot = require('../../model/ChatBot');
const { validationObject } = require('../../../config/validation');
const {
  removeAllPineconeVectors,
} = require('../../helpers/vectors/removeAllVectors');
const {
  removeVectorResponse,
} = require('../../helpers/vectors/removeVectorResponse');

const uploadFile = async (req, res) => {
  try {
    console.log('upload File called');

    const { botId } = req.body;

    let { files } = req;

    let userId = req.userId;

    let reqData = {
      id: botId,
    };

    let validationRuleObj = {
      id: validationObject.chatBot.id,
    };
    // validate Data
    const validate = new VALIDATOR(reqData, validationRuleObj);

    if (validate.fails()) {
      console.log('validation fails');
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: '',
        data: '',
        error: validate.errors.all(),
        errorCode: 'AUTH001',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    if (files.length < 1) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'File not Found',
        data: '',
        error: '',
        errorCode: 'VEC001',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const findBot = await ChatBot.findOne({ _id: botId });

    if (!findBot) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Bot Not Found',
        data: '',
        error: '',
        errorCode: 'CBT002',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    for (let i = 0; i < files.length; i++) {
      files[i]['id'] = uuidv4();
      let documentLoaderRes = await documentLoader(files[i], botId);

      if (!documentLoaderRes.hasError) {
        let addDocuments = await Attachments.create({
          id: files[i].id,
          filename: files[i].filename,
          size: files[i].size,
          fileType: files[i].mimetype,
          chatBotId: botId,
          userId: userId,
        });

        let addDocInBot = await ChatBot.findOneAndUpdate(
          { _id: botId },
          { $push: { attachments: addDocuments.id } },
          { new: true }
        );
      }
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'ChatBot created Successfully',
      data: findBot,
      error: '',
      errorCode: 'SU001',
      statusCode: HTTP_STATUS_CODE.OK,
    });
  } catch (error) {
    console.log('error: ', error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      message: 'Internal Server Error',
      data: '',
      error: '',
      errorCode: 'ERR500',
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER,
    });
  }
};

const removeVectors = async (req, res) => {
  try {
    console.log('removeVectors called');

    const { documentId, botId } = req.body;
    const userId = req.userId;

    let reqData = {
      id: documentId,
      botId: botId,
    };

    let validationRuleObj = {
      id: validationObject.documents.id,
      botId: validationObject.documents.botId,
    };

    // validate Data
    const validate = new VALIDATOR(reqData, validationRuleObj);

    if (validate.fails()) {
      console.log('validation fails');
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: '',
        data: '',
        error: validate.errors.all(),
        errorCode: 'AUTH001',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const findBot = await ChatBot.findOne({ _id: botId });

    if (!findBot) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Bot Not Found',
        data: '',
        error: '',
        errorCode: 'CBT002',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const removeVectorResult = await removeVectorResponse({
      namespace: botId,
      id: documentId,
    });

    if (removeVectorResult.hasError) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: '',
        data: '',
        error: '',
        errorCode: 'VEC003',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const updateAttachments = await Attachments.findOneAndUpdate(
      { _id: documentId, chatBotId: botId },
      { isDeleted: true, isActive: false }
    );

    const updateChatBoot = await ChatBot.findOneAndUpdate(
      { _id: botId },
      { $pull: { attachments: documentId } }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Documents Deleted',
      data: '',
      error: '',
      errorCode: 'SU001',
      statusCode: HTTP_STATUS_CODE.OK,
    });
  } catch (error) {
    console.log('error: ', error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      message: 'Internal Server Error',
      data: '',
      error: '',
      errorCode: 'ERR500',
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER,
    });
  }
};

const removeAllVectors = async (req, res) => {
  try {
    console.log('removeAllVectors called');

    const { botId } = req.body;
    const userId = req.userId;

    let reqData = {
      botId: botId,
    };

    let validationRuleObj = {
      botId: validationObject.documents.botId,
    };

    // validate Data
    const validate = new VALIDATOR(reqData, validationRuleObj);

    if (validate.fails()) {
      console.log('validation fails');
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: '',
        data: '',
        error: validate.errors.all(),
        errorCode: 'AUTH001',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const findBot = await ChatBot.findOne({ _id: botId });

    if (!findBot) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Bot Not Found',
        data: '',
        error: '',
        errorCode: 'CBT002',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const removeAllVectorsResponse = await removeAllPineconeVectors({
      namespace: botId,
    });

    if (removeAllVectorsResponse.hasError) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Error In Removing Vectors',
        data: '',
        error: '',
        errorCode: 'CBT003',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const updateAttachments = await Attachments.updateMany(
      { chatBotId: botId },
      { isDeleted: true, isActive: false }
    );

    const updateChatBoot = await ChatBot.findOneAndUpdate(
      { _id: botId },
      { attachments: [] }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Documents removed',
      data: '',
      error: '',
      errorCode: 'SU001',
      statusCode: HTTP_STATUS_CODE.OK,
    });
  } catch (error) {
    console.log('error: ', error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      message: 'Internal Server Error',
      data: '',
      error: '',
      errorCode: 'ERR500',
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER,
    });
  }
};

const getDocumentsList = async (req, res) => {
  try {
    console.log('getDocumentsList called...');
    let userId = req.userId;
    let { botId } = req.params;

    let reqData = {
      botId: botId,
    };

    let validationRuleObj = {
      botId: validationObject.documents.botId,
    };

    // validate Data
    const validate = new VALIDATOR(reqData, validationRuleObj);

    if (validate.fails()) {
      console.log('validation fails');
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: '',
        data: '',
        error: validate.errors.all(),
        errorCode: 'AUTH001',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const findBot = await ChatBot.findOne({ _id: botId });

    if (!findBot) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Bot Not Found',
        data: '',
        error: '',
        errorCode: 'CBT002',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const getList = await Attachments.find({
      chatBotId: botId,
      isDeleted: false,
      isActive: true,
    });

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Documents List',
      data: getList,
      error: '',
      errorCode: 'SU001',
      statusCode: HTTP_STATUS_CODE.OK,
    });
  } catch (error) {
    console.log('error: ', error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      message: 'Internal Server Error',
      data: '',
      error: '',
      errorCode: 'ERR500',
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER,
    });
  }
};

module.exports = {
  uploadFile,
  removeVectors,
  removeAllVectors,
  getDocumentsList,
};
