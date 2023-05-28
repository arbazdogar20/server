require('dotenv').config();
const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');

const cloudinary = require('./utils/cloudinaryUtils');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './'); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  },
});

// const upload = multer({storage: multer.memoryStorage()});
const upload = multer({storage: storage});

app.post('/upload', upload.single('fileName'), async (req, res) => {
  const file = req.file.path;

  try {
    const fileUpload = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
      public_id: `${req.file.originalname}`,
      folder: 'Files',
    });
    if (fileUpload) {
      fs.unlinkSync(file);
      return res.status(200).json(fileUpload.secure_url);
    }
  } catch (err) {
    let statusCode = err.http_code || 500;
    return res.status(statusCode).json(err);
  }
});

app.use('*', (req, res) => {
  res.status(200).send('<h1>This Is Express Server</h1>');
});

app.listen(5000, (req, res) => {
  console.log('Server Is Ruuning');
});
