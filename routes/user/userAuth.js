const express = require('express');
const {
  registerUser,
  login,
  emailVerification,
  forgotPassword,
  verifyForgotEmail,
  changeForgotPassword,
} = require('../../api/controller/Auth/userAuthController');
const { isUser } = require('../../api/middleware/Auth/isUser');
const router = express.Router();

router.post('/signUp', registerUser);
router.post('/login', login);
router.get('/emailVerification', emailVerification);
router.post('/forgotPassword', forgotPassword);
router.get('/verifyForgotEmail', verifyForgotEmail);
router.post('/changeForgotPassword', isUser, changeForgotPassword);

module.exports = router;
