const FRONTEND_URL = {
  REDIRECT_ON_EMAIL_VERIFICATION: process.env.FRONTEND_URL + `/home`,
  REDIRECT_ON_FORGOT_PASSWORD_VERIFICATION:
    process.env.FRONTEND_URL + `/setNewPassword`,
};

const BACKEND_URL = {
  REGISTER_USER_EMAIL_VERIFICATION:
    process.env.SERVER_URL + `/user/emailVerification`,
  FORGOT_PASSWORD_EMAIL_VERIFICATION:
    process.env.SERVER_URL + `/user/verifyForgotEmail`,
};

module.exports = { FRONTEND_URL, BACKEND_URL };
