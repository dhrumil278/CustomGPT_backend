const express = require('express');
const { isUser } = require('../../api/middleware/Auth/isUser');
const {
  listChatBot,
  updateChatBot,
  deleteChatBot,
  createChatBot,
  getById,
} = require('../../api/controller/Bot/botController');
const router = express.Router();

router.post('/createChatBot', isUser, createChatBot);
router.post('/deleteChatBot/:id', isUser, deleteChatBot);
router.post('/updateChatBot', isUser, updateChatBot);
router.get('/listChatBot', isUser, listChatBot);
router.get('/getById/:id', isUser, getById);

module.exports = router;
