const multer = require('multer');

// filter the file
const fileFilter = (req, file, cb) => {
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
  destination: (req, file, cb) => {
    cb(null, `./upload`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Math.floor(Date.now() / 1000)}` + '-' + file.originalname);
  },
});

// upload file main middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // max 50 MB size
  },
  fileFilter: fileFilter,
}).array('files', 5); // maximum 5 files are allowed

module.exports = {
  upload,
};
