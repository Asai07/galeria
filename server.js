const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener imágenes
app.get('/images', (req, res) => {
  const galleryPath = path.join(__dirname, 'public', 'galeria-webp');
  const images = [];

  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      return res.status(500).send('Error reading images directory');
    }
    if (!files.length) {
      console.warn('No images found in the directory');
      return res.status(404).send('No images found');
    }
    files.forEach(file => {
      images.push({
        webp: file,
        original: file.replace('.webp', '') // Asumiendo que los nombres de los archivos originales son similares a los webp
      });
    });
    res.json(images);
  });
});

// Ruta para descargar imágenes individuales
app.get('/download/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'galeria', imageName);

  res.download(imagePath, err => {
    if (err) {
      console.error('Error downloading image:', err);
      res.status(500).send('Error downloading image');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
