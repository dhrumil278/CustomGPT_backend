const { HTTP_STATUS_CODE } = require('../../../config/constant');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');

const isUser = async (req, res, next) => {
  console.log('isUser called:');
  try {
    let header = req.headers.authorization;
    console.log('header: ', header);
    if (header && header !== '') {
      let authType = header.split(' ')[0];

      if (authType !== 'Bearer') {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          message: 'Forbidden!',
          data: '',
          error: '',
          errorCode: 'AUTH011',
          statusCode: HTTP_STATUS_CODE.FORBIDDEN,
        });
      }
      let token = header.split(' ')[1];
      console.log('token: ', token);

      if (!token && token === '') {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          message: 'Forbidden!',
          data: '',
          error: '',
          errorCode: 'AUTH012',
          statusCode: HTTP_STATUS_CODE.FORBIDDEN,
        });
      }

      const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log('decode: ', decode);
      req.userId = decode.userId;

      const findUser = await User.findOne({
        _id: req.userId,
        isDeleted: false,
        isActive: true,
      });

      if (!findUser) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          message: 'Forbidden!',
          data: '',
          error: '',
          errorCode: 'AUTH013',
          statusCode: HTTP_STATUS_CODE.FORBIDDEN,
        });
      }

      console.log('findUser: ', findUser);
      if (findUser.accessToken !== token) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          message: 'Forbidden!',
          data: '',
          error: '',
          errorCode: 'AUTH014',
          statusCode: HTTP_STATUS_CODE.FORBIDDEN,
        });
      }
      return next();
    } else {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        message: 'Forbidden!',
        data: '',
        error: '',
        errorCode: 'AUTH014',
        statusCode: HTTP_STATUS_CODE.FORBIDDEN,
      });
    }
  } catch (error) {
    console.log('error: ', error);
    return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
      message: 'Forbidden!',
      data: '',
      error: '',
      errorCode: 'AUTH013',
      statusCode: HTTP_STATUS_CODE.FORBIDDEN,
    });
  }
};

module.exports = { isUser };
