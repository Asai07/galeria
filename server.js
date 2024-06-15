const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/images', (req, res) => {
    const imagesDir = path.join(__dirname, 'public/galeria-webp');
    const originalImagesDir = path.join(__dirname, 'public/galeria');

    fs.readdir(imagesDir, (err, webpFiles) => {
        if (err) {
            console.error('Error scanning directory:', err);
            return res.status(500).json({ error: 'Unable to scan directory' });
        }

        const originalFiles = fs.readdirSync(originalImagesDir);
        console.log('Original files:', originalFiles);

        // Create a mapping of webp files to their original files
        const imageMappings = webpFiles.filter(file => file.endsWith('.webp')).map(webpFile => {
            const originalFileBaseName = path.basename(webpFile, '.webp');
            const originalFile = originalFiles.find(file => {
                return path.basename(file, path.extname(file)) === originalFileBaseName;
            });
            if (originalFile) {
                console.log(`Mapped: ${webpFile} -> ${originalFile}`);
                return { webp: webpFile, original: originalFile };
            } else {
                console.warn(`No original file found for: ${webpFile}`);
                return { webp: webpFile, original: null };
            }
        });

        console.log('Images to send:', imageMappings); // Log the images being sent
        res.json(imageMappings);
    });
});

app.get('/download/:image', (req, res) => {
    const imageName = req.params.image;
    const originalImageDir = path.join(__dirname, 'public/galeria');
    const originalImage = path.join(originalImageDir, imageName);

    console.log(`Requested image: ${imageName}`);
    console.log(`Original image path: ${originalImage}`);

    fs.access(originalImage, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Error accessing file:', err);
            return res.status(404).send('File not found');
        } else {
            res.download(originalImage, imageName, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    return res.status(500).send('Error downloading file.');
                } else {
                    console.log(`File downloaded: ${imageName}`);
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
