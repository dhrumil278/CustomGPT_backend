const { HTTP_STATUS_CODE } = require('../../../config/constant');
const multer = require('multer');

// filter the file
const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    console.log('fileFilter pass');
    cb(null, true);
  } else {
    console.log('fileFilter fail');
    cb(null, false);
  }
};

// define the storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./upload`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Math.floor(Date.now() / 1000)}` + '-' + file.originalname);
  },
});

// upload file main middleware

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
}).array('files', 5);

module.exports = {
  upload,
};
