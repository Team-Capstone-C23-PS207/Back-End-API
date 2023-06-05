const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { getRecommendation } = require('./tmp/model_api/recommend');
const { detectWaste } = require('./tmp/model_api/detect');

// Inisialisasi Express
const app = express();
app.use(bodyParser.json());

// Konfigurasi multer untuk mengelola file yang diunggah
const upload = multer({
    dest: 'uploads/', // direktori penyimpanan file
});

// Mendefinisikan endpoint untuk menerima data gambar dan melakukan deteksi sampah
// endpoint /detect
app.post('/detect', upload.single('image'), async (req, res) => {
    // Mendapatkan file gambar dari request
    const imageFile = req.file;

    try {
        // Melakukan deteksi sampah menggunakan model ML
        const detectedWaste = await detectWaste(imageFile.path);

        // Mengirim hasil deteksi ke sistem rekomendasi
        const recommendation = await sendToRecommend(detectedWaste);

        // Mengembalikan hasil deteksi sampah
        res.json({ HasilDeteksi: detectedWaste, Rekomendasi: recommendation });
    } catch (error) {
        console.error('Terjadi kesalahan saat melakukan deteksi sampah:', error);
        res
            .status(500)
            .json({ error: 'Terjadi kesalahan saat melakukan deteksi sampah.' });
    }
});

// Mendefinisikan endpoint untuk merekomendasikan pengolahan sampah berdasarkan hasil deteksi
// endpoint recommend
app.post('/recommend', async (req, res) => {
    // Mendapatkan hasil deteksi sampah dari request
    const detectedWaste = req.body.detectedWaste;

    try {
        // Mengambil rekomendasi pengolahan sampah berdasarkan hasil deteksi
        const recommendation = await getRecommendation(detectedWaste);

        // Mengembalikan rekomendasi pengolahan sampah
        res.json({ recommendation });
    } catch (error) {
        console.error(
            'Terjadi kesalahan saat merekomendasikan pengolahan sampah:',
            error
        );
        res.status(500).json({
            error: 'Terjadi kesalahan saat merekomendasikan pengolahan sampah.',
        });
    }
});

// Fungsi untuk mengirim hasil deteksi ke sistem rekomendasi
async function sendToRecommend(detectedWaste) {
    const recommendation = await getRecommendation(detectedWaste);
    return recommendation;
}

module.exports = { app };