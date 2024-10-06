const ChatBot = require('../../model/ChatBot');
const { HTTP_STATUS_CODE, VALIDATOR } = require('../../../config/constant');
const { validationObject } = require('../../../config/validation');
const User = require('../../model/User');

const createChatBot = async (req, res) => {
  try {
    console.log('createChatBot called');

    let { name } = req.body;

    let userId = req.userId;

    let reqData = {
      name: name,
    };

    let validationRuleObj = {
      name: validationObject.chatBot.name,
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

    const createBot = await ChatBot.create({ name: name, user: userId });

    if (!createBot) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'ChatBot is not created',
        data: '',
        error: '',
        errorCode: 'CBT001',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const addBotInUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { chatBots: createBot.id } },
      { new: true }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'ChatBot created Successfully',
      data: createBot,
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

const deleteChatBot = async (req, res) => {
  try {
    console.log('deleteChatBot called');

    let { id } = req.params;

    let userId = req.userId;

    let reqData = {
      id: id,
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

    // const findBot = await ChatBot.findOne({
    //   _id: id,
    //   isDeleted: false,
    //   isActive: true,
    // });

    // if (!findBot) {
    //   return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
    //     message: 'Bot Not Found',
    //     data: '',
    //     error: '',
    //     errorCode: 'CBT002',
    //     statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
    //   });
    // }

    const deleteChatBot = await ChatBot.findOneAndUpdate(
      { _id: id },
      { isDeleted: true, isActive: false },
      { new: true }
    );

    const deleteChatBotReference = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { chatBots: id } },
      { new: true }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'ChatBot Deleted Successfully',
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

const updateChatBot = async (req, res) => {
  try {
    console.log('updateChatBot called');

    let { id, name } = req.body;

    let reqData = {
      id: id,
      name: name,
    };

    let validationRuleObj = {
      id: validationObject.chatBot.id,
      name: validationObject.chatBot.name,
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

    const findBot = await ChatBot.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    });

    if (!findBot) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Bot Not Found',
        data: '',
        error: '',
        errorCode: 'CBT002',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    const updateChatBot = await ChatBot.findOneAndUpdate(
      { _id: id },
      { name: name },
      { new: true }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'ChatBot Deleted Successfully',
      data: updateChatBot,
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

const listChatBot = async (req, res) => {
  try {
    console.log('listChatBot called');

    const userId = req.userId;

    const getList = await User.findOne({ _id: userId }).populate({
      path: 'chatBots',
      options: { sort: { createdAt: -1 } },
    });

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'ChatBot List',
      data: getList.chatBots,
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

const getById = async (req, res) => {
  try {
    console.log('listChatBot called');

    let { id } = req.params;

    let userId = req.userId;

    let reqData = {
      id: id,
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

    const findBot = await ChatBot.findOne({ _id: id });

    if (!findBot) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Bot Not Found',
        data: '',
        error: '',
        errorCode: 'CBT002',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'ChatBot',
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

module.exports = {
  createChatBot,
  deleteChatBot,
  updateChatBot,
  listChatBot,
  getById,
};
