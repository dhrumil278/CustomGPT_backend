const express = require('express');
const { upload } = require('../../api/helpers/FileUpload/upload');
const {
  uploadFile,
  getDocumentsList,
  removeAllVectors,
  removeVectors,
} = require('../../api/controller/Vector/vectorController');
const { isUser } = require('../../api/middleware/Auth/isUser');
const router = express.Router();

router.post('/upload', isUser, upload, uploadFile);
router.post('/removeVectors', isUser, removeVectors);
router.post('/removeAllVectors', isUser, removeAllVectors);
router.get('/getDocumentsList/:botId', isUser, getDocumentsList);

module.exports = router;
