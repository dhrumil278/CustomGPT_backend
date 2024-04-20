const nodemailer = require('nodemailer');

const sendMail = async (data) => {
  console.log('sendMail called...');
  try {
    return new Promise((resolve, reject) => {
      let result = {};
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER_AUTH,
          pass: process.env.USER_PASS,
        },
      });

      transporter.sendMail(data, (err, info) => {
        if (err) {
          console.log('err: ', err);
          result['hasError'] = true;
          resolve(result);
        } else {
          console.log('mail Send successFully');
          result['hasError'] = false;
          result['data'] = info.response;
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.log('error: ', error);
    return {
      hasError: true,
      error: error,
    };
  }
};

module.exports = {
  sendMail,
};
