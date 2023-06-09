const { app } = require('./server');

// Menjalankan server pada port yang ditentukan
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});