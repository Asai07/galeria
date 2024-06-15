const mongoose = require('mongoose');

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/gallery', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el esquema y modelo de imagen
const imageSchema = new mongoose.Schema({
  webp: String,
  original: String
});

const Image = mongoose.model('Image', imageSchema);

// Lista de imágenes para agregar
const images = [
  { webp: 'image1.webp', original: 'image1' },
  { webp: 'image2.webp', original: 'image2' },
  // Agregar más imágenes aquí
];

// Función para inicializar la base de datos
const initializeImages = async () => {
  try {
    await Image.deleteMany({}); // Limpiar la colección de imágenes
    await Image.insertMany(images); // Insertar imágenes
    console.log('Images initialized successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error initializing images:', err);
    mongoose.disconnect();
  }
};

// Ejecutar la función de inicialización
initializeImages();
