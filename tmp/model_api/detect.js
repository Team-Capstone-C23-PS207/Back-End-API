const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const modelPath = './tmp/tfjs_my_model/model.json';

// Fungsi untuk melakukan deteksi sampah menggunakan model ML
async function detectWaste(imagePath) {
    // Mengimpor model ML dari file JSON
    const model = await tf.loadLayersModel(`file://${modelPath}`);

    // Mempersiapkan gambar untuk deteksi
    const image = await loadImage(imagePath);
    const processedImage = await processImage(image);

    // Melakukan prediksi menggunakan model
    const inputTensor = tf.expandDims(processedImage, 0); // Mengubah dimensi gambar ke bentuk yang diterima oleh model
    const predictions = model.predict(inputTensor);
    const predictedClass = predictions.argMax(1).dataSync()[0];

    // Mengambil label yang sesuai dengan hasil prediksi
    const labels = ['AluCan', 'Glass', 'PET'];
    const detectedWaste = labels[predictedClass];

    if (labels.includes(detectedWaste)) {
        return detectedWaste;
    } else {
        return 'Sampah tidak dikenali';
    }
}

// Fungsi untuk memuat gambar menggunakan TensorFlow.js
async function loadImage(imagePath) {
    const imageBuffer = await fs.promises.readFile(imagePath); // Baca gambar sebagai buffer
    const image = tf.node.decodeImage(imageBuffer); // Ubah buffer menjadi tf.Tensor menggunakan decodeImage()
    return image;
}

// Fungsi untuk memproses gambar sebelum deteksi
async function processImage(image) {
    // Mengubah ukuran gambar menjadi yang sesuai dengan model
    const resizedImage = tf.image.resizeBilinear(image, [150, 150]);

    // Normalisasi piksel gambar
    const normalizedImage = resizedImage.div(255);

    return normalizedImage;
}

module.exports = { detectWaste };