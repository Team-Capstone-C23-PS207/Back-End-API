const { app } = require('./server');

// Menjalankan server pada port yang ditentukan
const port = 3000; 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});