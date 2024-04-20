const { EVENTS, VALIDATOR } = require('./constant');

const userValidation = (reqData) => {
  console.log('userValidation called...');
  try {
    const validate = new VALIDATOR(data, rules);
    let result = {};

    if (validate.passes()) {
      console.log('validation success');
      result['hasError'] = false;
    }
    if (validate.fails()) {
      console.log('validation fails');
      result['hasError'] = true;
      result['error'] = validate.errors.all();
    }

    return result;
  } catch (error) {
    console.log('error: ', error);
    return {
      hasError: true,
      error: error,
    };
  }
};

const validationObject = {
  user: {
    email: 'string|required',
    password: 'string|required',
    firstName: 'string|required',
    lastName: 'string|required',
    token: 'string|required',
  },
  chatBot: {
    name: 'string|required',
    id: 'string|required',
  },
  documents: {
    id: 'string|required',
    botId: 'string|required',
  },
};

module.exports = {
  userValidation,
  validationObject,
};
