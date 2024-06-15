const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'public/galeria');
const outputDir = path.join(__dirname, 'public/galeria-webp');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading input directory:', err);
        return;
    }

    files.forEach(file => {
        const inputFile = path.join(inputDir, file);
        const outputFile = path.join(outputDir, `${path.parse(file).name}.webp`);

        sharp(inputFile)
            .webp({ quality: 80 })
            .toFile(outputFile, (err, info) => {
                if (err) {
                    console.error('Error converting file:', err);
                } else {
                    console.log(`Converted ${file} to ${outputFile}`);
                }
            });
    });
});
