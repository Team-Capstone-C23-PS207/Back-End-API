const { app } = require('./server');

// Menjalankan server pada port yang ditentukan
const port = process.env.PORT || 8080; // Menggunakan port yang diberikan oleh variabel lingkungan PORT, atau port 8080 jika tidak ada
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});