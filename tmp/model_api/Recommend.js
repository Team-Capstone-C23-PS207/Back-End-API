const fs = require('fs');
const csv = require('csv-parser');

// Fungsi untuk membaca file CSV dan mendapatkan rekomendasi pengolahan sampah berdasarkan hasil deteksi
async function getRecommendation(detectedWaste) {
    let recommendation = '';

    // Menentukan rekomendasi berdasarkan jenis sampah yang dideteksi
    switch (detectedWaste) {
        case 'AluCan':
            try {
                const data = await readCSV('./tmp/recommend_data/alucan_handicraft.csv');
                recommendation = data;
            } catch (error) {
                console.error(error);
                recommendation = [];
            }
            break;
        case 'Glass':
            try {
                const data = await readCSV('./tmp/recommend_data/glass_handicraft.csv');
                recommendation = data;
            } catch (error) {
                console.error(error);
                recommendation = [];
            }
            break;
        case 'PET':
            try {
                const data = await readCSV('./tmp/recommend_data/pet_handicraft.csv');
                recommendation = data;
            } catch (error) {
                console.error(error);
                recommendation = [];
            }
            break;
        default:
            recommendation = [];
            break;
    }

    return recommendation; // Mengembalikan rekomendasi pengolahan sampah
}

// Fungsi untuk membaca file CSV
function readCSV(filename) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filename)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

module.exports = { getRecommendation };
