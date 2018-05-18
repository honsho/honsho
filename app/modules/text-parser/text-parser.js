const fs = require('fs');
const path = require('path');
const { spawn, fork } = require('child_process');
const PNG = require('pngjs').PNG;
const sharp = require('sharp');
const imageCleaner = require('./image-cleaner');

const cleanTempImage = imagePath => {
    fs.stat(imagePath, (error, stats) => {
        if (!error) {
            fs.unlink(imagePath, () => {});
        }
    });
}

const parse = (imagePath, image, { leftTopX, leftTopY, rightBottomX, rightBottomY }, options = {}) => {
    return new Promise((resolve, reject) => {
        const parserPath = path.resolve(__dirname, '../../../tesseract/tesseract.exe');
        const dictionariesPath = path.resolve(__dirname, '../../../tesseract');
        const width = Math.abs(leftTopX - rightBottomX);
        const height = Math.abs(leftTopY - rightBottomY);

        new PNG().parse(new Buffer(image), function (error, png) {
            if (error) return reject();

            const slicedPng = new PNG({ width, height });
            PNG.bitblt(png.pack(), slicedPng, leftTopX, leftTopY, width, height, 0, 0);

            let modifiersPromise = Promise.resolve();

            if (options.imageCleaner) {
                modifiersPromise = modifiersPromise.then(() => {
                    return imageCleaner({ png: slicedPng, imagePath, ...options.imageCleaner });
                });
            }

            modifiersPromise.then(png => {
                const resizer = sharp().resize(png.width * 3, png.height * 3).png();
                const writeStream = png.pack().pipe(resizer).pipe(fs.createWriteStream(imagePath));

                writeStream.on('finish', () => {
                    const parser = spawn(parserPath, ['--tessdata-dir', dictionariesPath, imagePath, '-l', 'eng', 'stdout', '--oem','1']);

                    let text = '';
                    parser.stdout.on('data', textPart => text += textPart);
                    parser.stdout.on('close', () => {
                        cleanTempImage(imagePath);
                        resolve(text.trim() || 'Ошибка распознавания текста.');
                    });
                });
                writeStream.on('error', () => reject());
            });
        });
    });
}

process.on('message', ({ imagePath, image, pos, options }) => {
    parse(imagePath, image, pos, options)
        .then(text => process.send(text))
        .catch(e => process.send((e && e.message) || 'Ошибка распознавания текста.'));
});