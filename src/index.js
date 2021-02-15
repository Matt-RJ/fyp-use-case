const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const Jimp = require('jimp');
const multer = require('multer');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));

const ALLOWED_IMAGE_MIMES = [
  Jimp.MIME_PNG,
  Jimp.MIME_JPEG,
  Jimp.MIME_GIF
];

// Test route
app.get('/v1/Test', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Image resizing.
 * Request takes form-data/multipart with:
 * - Image: Encoded image
 * - ResizeX, ResizeY: New image dimensions
 * - Allowed image types: png, jpg, gif
 * TODO: Limit image size
 */
app.post('/v1/Image/Resize/', upload.single('Image'), async (req, res) => {
  console.log('Resize endpoint hit');
  const image = req.file;
  const resizeX = req.body.ResizeX;
  const resizeY = req.body.ResizeY;

  if (!image) {
    res.status(400).send('Image is required');
    return;
  }
  if (!(image.mimetype || ALLOWED_IMAGE_MIMES.includes(image.mimetype))) {
    const imageTypes = ALLOWED_IMAGE_MIMES.map((img) => img.split('/')[1]).join(', ');
    res.status(400).send(`Image must be one of the following types: ${imageTypes}`);
    return;
  }
  if (!(resizeX && resizeY)) {
    res.status(400).send('Both ResizeX and ResizeY are required');
    return;
  }

  console.log(req.file);
  console.log(req.body);

  try {
    const loadedImage = await Jimp.read(image.buffer);
    let processedImage = loadedImage.resize(parseInt(resizeX, 10), parseInt(resizeY, 10));
    processedImage = await loadedImage.getBufferAsync(image.mimetype);
    res.set('Content-Type', image.mimetype);
    res.send(processedImage);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.all('*', (req, res) => {
  console.log(`Missing endpoint '${req.originalUrl}' hit`);
  res.status(404);
  res.send('Not Found');
});

module.exports.handler = serverless(app, {
  binary: ALLOWED_IMAGE_MIMES
});
