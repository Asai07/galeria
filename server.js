const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/gallery', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el esquema y modelo de imagen
const imageSchema = new mongoose.Schema({
  webp: String,
  original: String
});

const Image = mongoose.model('Image', imageSchema);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Ruta para el archivo HTML principal
app.get('/', (req, res) => {
  console.log('Serving index.html');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener la lista de imágenes
app.get('/images', async (req, res) => {
  console.log('GET /images called');
  try {
    const images = await Image.find();
    console.log('Sending image data:', images);
    res.json(images);
  } catch (err) {
    console.error('Error fetching images from database:', err);
    res.status(500).send('Error fetching images from database');
  }
});

// Ruta para agregar imágenes (para propósitos de prueba)
app.post('/images', async (req, res) => {
  const newImage = new Image({
    webp: 'example.webp',
    original: 'example'
  });

  try {
    const savedImage = await newImage.save();
    res.json(savedImage);
  } catch (err) {
    console.error('Error saving image to database:', err);
    res.status(500).send('Error saving image to database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
