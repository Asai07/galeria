const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// Configurar multer para almacenar archivos subidos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'galeria');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Ruta para el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener imágenes
app.get('/images', (req, res) => {
  const galleryPath = path.join(__dirname, 'public', 'galeria');
  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading images directory');
    }
    const images = files.map(file => ({ webp: file, original: file }));
    res.json(images);
  });
});

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  res.sendStatus(200);
});

// Ruta para descargar imágenes individuales
app.get('/download/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'galeria', imageName);
  res.download(imagePath, err => {
    if (err) {
      res.status(500).send('Error downloading image');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
