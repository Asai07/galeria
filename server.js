// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// Configurar multer para almacenar archivos subidos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'galeria'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('Image uploaded:', req.file);
  res.sendStatus(200);
});

// (Resto de las rutas y configuraciones)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
