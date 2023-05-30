const express = require('express');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');

// Inisialisasi Express
const app = express();
app.use(bodyParser.json());

// Konfigurasi multer untuk mengelola file yang diunggah
const upload = multer({
  dest: 'uploads/', // direktori penyimpanan file
});

// Mendefinisikan endpoint untuk menerima data gambar dan melakukan deteksi sampah
app.post('/detect', upload.single('image'), async (req, res) => {
  // Mendapatkan file gambar dari request
  const imageFile = req.file;

  try {
    // Melakukan deteksi sampah menggunakan model ML
    const detectedWaste = await detectWaste(imageFile.path);

    // Mengembalikan hasil deteksi sampah
    res.json({ result: detectedWaste });
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan deteksi sampah:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat melakukan deteksi sampah.' });
  }
});

  const modelData = require('./tmp/tfjs_my_model/model.json');


// Fungsi untuk melakukan deteksi sampah menggunakan model ML
async function detectWaste(imagePath) {
  // Mengimpor model ML dari file JSON
  const model = await tf.loadLayersModel(`file://${modelData}`);

  // Mempersiapkan gambar untuk deteksi
  const image = await loadImage(imagePath);
  const processedImage = await processImage(image);

  // Melakukan prediksi menggunakan model
  const inputTensor = tf.tensor(processedImage);
  const predictions = model.predict(inputTensor);
  const predictedClass = predictions.argMax(1).dataSync()[0];

  // Mengambil label yang sesuai dengan hasil prediksi
  const labels = ['Plastik', 'Kertas', 'Logam', 'Kaca'];
  const detectedWaste = labels[predictedClass];

  return detectedWaste;
}

// Fungsi untuk memuat gambar menggunakan TensorFlow.js
async function loadImage(imagePath) {
  const image = tf.node.decodeImage(await fs.promises.readFile(imagePath));
  return image;
}

// Fungsi untuk memproses gambar sebelum deteksi
async function processImage(image) {
  // Mengubah ukuran gambar menjadi yang sesuai dengan model
  const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
  
  // Normalisasi piksel gambar
  const normalizedImage = resizedImage.div(tf.scalar(255));

  // Mengubah dimensi gambar ke bentuk yang diterima oleh model
  const processedImage = normalizedImage.expandDims();

  return processedImage;
}

// Menjalankan server pada port yang ditentukan
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});