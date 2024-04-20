const { VALIDATOR, HTTP_STATUS_CODE } = require('../../../config/constant');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { validationObject } = require('../../../config/validation');
const { generateToken } = require('../../helpers/Auth/generateToken');
const User = require('../../model/User');
const { sendMail } = require('../../helpers/Notification/sendEmail');

let registerUser = async (req, res) => {
  console.log('Register User Called...');
  try {
    let { email, password, firstName, lastName } = req.body;

    let reqData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    };

    let validationRuleObj = {
      email: validationObject.user.email,
      password: validationObject.user.password,
      firstName: validationObject.user.firstName,
      lastName: validationObject.user.lastName,
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

    // Check is this a New User or Not
    let findUser = await User.findOne({
      email: email,
      isDeleted: false,
      isActive: true,
      isVerified: true,
    });

    if (findUser) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'User already Exists',
        data: '',
        error: '',
        errorCode: 'AUTH002',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // Generate the Hash Password
    let hash = await bcrypt.hash(password, 10);

    const createUser = await User.create({ ...reqData, password: hash });

    if (!createUser) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'User NOt Created',
        data: '',
        error: '',
        errorCode: 'AUTH003',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // Sign the Token
    let payload = {
      id: createUser.id,
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: '3d',
    };

    let token = await generateToken(payload);

    if (token.hasError) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Token not Created',
        data: '',
        error: '',
        errorCode: 'AUTH004',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // save token in DB
    let updateUser = await User.findOneAndUpdate(
      { _id: createUser.id },
      { accessToken: token.data },
      { new: true }
    );

    let link = `${process.env.SERVER_URL}/user/emailVerification?token=${token.data}`;

    let mailData = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: 'Welcome to Ai.DEE | Verify your Email',
      cc: '',
    };

    const html = await ejs.renderFile(
      path.join('./view/emailTemplate', 'verifyEmail.ejs'),
      { link },
      { async: true }
    );

    mailData['html'] = html;

    let mailResult = await sendMail(mailData);

    if (mailResult.hasError == true) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Mail Not Send, Please click on resend Email',
        data: '',
        error: '',
        errorCode: 'AUTH005',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    } else {
      delete updateUser.password;
      createUser['accessToken'] = token.data;
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: 'Verification Email Send!',
        data: updateUser,
        error: '',
        errorCode: 'SU001',
        statusCode: HTTP_STATUS_CODE.OK,
      });
    }
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

let login = async (req, res) => {
  console.log('login called...');
  try {
    let { email, password } = req.body;

    let reqData = {
      email: email,
      password: password,
    };

    let validationRuleObj = {
      email: validationObject.user.email,
      password: validationObject.user.password,
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

    // Check is this a New User or Not
    let findUser = await User.findOne({
      email: email,
      isDeleted: false,
      isActive: true,
      isVerified: true,
    });

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'User Not Found',
        data: '',
        error: '',
        errorCode: 'AUTH002',
        statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      });
    }

    let compare = await bcrypt.compare(password, findUser.password);

    // return the error on password incorrect
    if (compare === false) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Incorrect Password',
        data: '',
        error: '',
        errorCode: 'AUTH006',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // prepared the object for generate the token
    let payload = {
      id: findUser.id,
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: '3d',
    };

    // function for generate the token
    let token = await generateToken(payload);

    if (token.hasError) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Token not Created',
        data: '',
        error: '',
        errorCode: 'AUTH004',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // save token in DB
    let updateUser = await User.findOneAndUpdate(
      { _id: findUser.id },
      { accessToken: token.data },
      { new: true }
    );

    delete updateUser.password;

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Login Success!',
      data: updateUser,
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

let emailVerification = async (req, res) => {
  console.log('Email Verification called...');
  try {
    // get the data from the req body
    let { token } = req.query;

    // get the userId from the middleware
    // let userId = req.userId;

    let reqData = {
      token: token,
    };

    let validationRuleObj = {
      token: validationObject.user.token,
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

    // Check is this a New User or Not
    let findUser = await User.findOne({
      accessToken: token,
      isDeleted: false,
      isActive: true,
    });

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'User Not Found',
        data: '',
        error: '',
        errorCode: 'AUTH002',
        statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    let userId = decode.userId;

    // prepared the payload to sign new token
    let payload = {
      id: userId,
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: '3d',
    };

    // call function for generate the token
    let newToken = await generateToken(payload);

    if (newToken.hasError) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Token not Created',
        data: '',
        error: '',
        errorCode: 'AUTH004',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // save token in DB
    let updateUser = await User.findOneAndUpdate(
      { _id: findUser.id },
      { accessToken: newToken.data, isVerified: true },
      { new: true }
    );

    delete updateUser.password;
    // let finalResult = { ...findUser, accessToken: newToken.data };
    // delete finalResult.password;

    return res.redirect(`${process.env.FRONTEND_URL}/home?${newToken.data}`);
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

let forgotPassword = async (req, res) => {
  console.log('forgotPassword called....');
  try {
    let { email } = req.body;

    let reqData = {
      email: email,
    };

    let validationRuleObj = {
      email: validationObject.user.email,
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

    // Check is this a New User or Not
    let findUser = await User.findOne({
      email: email,
      isDeleted: false,
      isActive: true,
      isVerified: true,
    });

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'User Not Found',
        data: '',
        error: '',
        errorCode: 'AUTH002',
        statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      });
    }

    // prepared the payload to sign new token
    let payload = {
      id: findUser.id,
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: '3d',
    };

    // call function for generate the token
    let token = await generateToken(payload);

    // save token in DB
    let updateUser = await User.findOneAndUpdate(
      { _id: findUser.id },
      { accessToken: token.data },
      { new: true }
    );

    let link = `${process.env.SERVER_URL}/user/verifyForgotEmail?token=${token.data}`;

    let mailData = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: 'Welcome to Ai.DEE | Confirm you Email',
      cc: '',
    };

    const html = await ejs.renderFile(
      path.join('./view/emailTemplate', 'forgotPassVerify.ejs'),
      { link },
      { async: true }
    );

    mailData['html'] = html;

    let mailResult = await sendMail(mailData);

    if (mailResult.hasError == true) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Mail Not Send, Please click on resend Email',
        data: '',
        error: '',
        errorCode: 'AUTH005',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    } else {
      delete updateUser.password;
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: 'Verification Email Send!',
        data: updateUser,
        error: '',
        errorCode: 'SU001',
        statusCode: HTTP_STATUS_CODE.OK,
      });
    }
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

let verifyForgotEmail = async (req, res) => {
  console.log('verifyForgotEmail called...');
  try {
    // get the data from the req body
    let { token } = req.query;

    let reqData = {
      token: token,
    };

    let validationRuleObj = {
      token: validationObject.user.token,
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

    // Check is this a New User or Not
    let findUser = await User.findOne({
      accessToken: token,
      isDeleted: false,
      isActive: true,
    });

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'User Not Found',
        data: '',
        error: '',
        errorCode: 'AUTH002',
        statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    let userId = decode.userId;

    // prepared the payload to sign new token
    let payload = {
      id: userId,
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: '3d',
    };

    // call function for generate the token
    let newToken = await generateToken(payload);

    if (newToken.hasError) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Token not Created',
        data: '',
        error: '',
        errorCode: 'AUTH004',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // save token in DB
    let updateUser = await User.findOneAndUpdate(
      { _id: findUser.id },
      { accessToken: newToken.data },
      { new: true }
    );

    // let finalResult = { ...findUser, accessToken: newToken.data };
    delete updateUser.password;

    return res.redirect(
      `${process.env.FRONTEND_URL}/setNewPassword?accessToken=${newToken.data}`
    );
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

let changeForgotPassword = async (req, res) => {
  console.log('changePassword called...');
  try {
    // get the data from the req body
    let { password } = req.body;

    // get the userId from the middleware
    let userId = req.userId;

    let reqData = {
      password: password,
    };

    let validationRuleObj = {
      password: validationObject.user.password,
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

    // Check is this a New User or Not
    let findUser = await User.findOne({
      _id: userId,
      isDeleted: false,
      isActive: true,
    });

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'User Not Found',
        data: '',
        error: '',
        errorCode: 'AUTH002',
        statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      });
    }

    // Generate the Hash Password
    let hash = await bcrypt.hash(password, 10);

    // Sign the Token
    let payload = {
      id: userId,
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: '3d',
    };

    // call function for generate the token
    let newToken = await generateToken(payload);

    if (newToken.hasError) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Token not Created',
        data: '',
        error: '',
        errorCode: 'AUTH004',
        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      });
    }

    // save token in DB
    let updateUser = await User.findOneAndUpdate(
      { _id: findUser.id },
      { accessToken: newToken.data, isVerified: true },
      { new: true }
    );

    // let finalResult = { ...findUser, accessToken: newToken.data };
    delete updateUser.password;

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'Verification Success',
      data: updateUser,
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
  registerUser,
  login,
  emailVerification,
  forgotPassword,
  verifyForgotEmail,
  changeForgotPassword,
};
