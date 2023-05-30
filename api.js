const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const tf = require('@tensorflow/tfjs-node');

const app = express();
const port = 3000;

// Menggunakan body-parser untuk membaca JSON
app.use(bodyParser.json());

// Menggunakan CORS untuk mengizinkan panggilan dari domain lain
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Memuat model dari file JSON
const loadModel = async () => {
  const modelPath = 'tmp/tfjs_my_model/model.json';
  const model = await tf.loadLayersModel('file://' + modelPath);
  return model;
};

// Memuat model saat server dimulai
let model;
loadModel().then((loadedModel) => {
  model = loadedModel;
  console.log('Model loaded');
}).catch((err) => {
  console.log('Failed to load model:', err);
});

// Menangani permintaan POST ke endpoint '/scan'
app.post('/scan', async (req, res) => {
  try {
    const imagePath = req.body.imagePath;

    // Membaca gambar dari penyimpanan offline
    const imageBuffer = fs.readFileSync(path.join(__dirname, imagePath));
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imageTensor = tf.browser.fromPixels(imageData).toFloat().expandDims();

    // Melakukan prediksi menggunakan model
    const predictions = await model.predict(imageTensor).data();

    // Mengirimkan hasil prediksi sebagai respons
    res.json({ predictions });
  } catch (error) {
    console.error('Error during scanning:', error);
    res.status(500).json({ error: 'Failed to scan the image' });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});