const fs = require('fs');
const path = require('path');
const { spawn, fork } = require('child_process');
const PNG = require('pngjs').PNG;
const screenshot = require('desktop-screenshot');
const imageCleaner = require('./image-cleaner');

const cleanTempImage = imagePath => {
    fs.stat(imagePath, (error, stats) => {
        if (!error) {
            fs.unlink(imagePath, () => {});
        }
    });
}

const parse = (imagePath, { leftTopX, leftTopY, rightBottomX, rightBottomY }, options = {}) => {
    return new Promise((resolve, reject) => {
        const parserPath = path.resolve(__dirname, '../../../tesseract/tesseract.exe');
        const dictionariesPath = path.resolve(__dirname, '../../../tesseract');
        const width = Math.abs(leftTopX - rightBottomX);
        const height = Math.abs(leftTopY - rightBottomY);

        screenshot(imagePath, (error, complete) => {
            if (error) return reject();
            
            fs.createReadStream(imagePath)
                .pipe(new PNG())
                .on('parsed', function() {
                    const pngImage = new PNG({ width, height });
                    PNG.bitblt(this.pack(), pngImage, leftTopX, leftTopY, width, height, 0, 0);

                    let pngStream;
                    try {
                        pngStream = pngImage.pack();
                        pngStream.on('error', () => reject());
                    } catch (e) {
                        return reject();
                    }

                    const writeStream = pngStream.pipe(fs.createWriteStream(imagePath));
                    writeStream.on('finish', () => {
                        let modifiersPromise = Promise.resolve();

                        if (options.imageCleaner) {
                            modifiersPromise = modifiersPromise.then(async () => await imageCleaner({ imagePath, ...options.imageCleaner }));
                        }

                        modifiersPromise.then(() => {
                            const parser = spawn(parserPath, ['--tessdata-dir', dictionariesPath, imagePath, '-l', 'eng', 'stdout', '--oem','1']);
            
                            let text = '';
                            parser.stdout.on('data', textPart => text += textPart);
                            parser.stdout.on('close', () => {
                                cleanTempImage(imagePath);
                                resolve(text.trim() || 'Ошибка распознавания текста.');
                            });
                        })
                    });
                    writeStream.on('error', () => reject());
                });
        });
    });
}

process.on('message', ({ imagePath, pos, options }) => {
    parse(imagePath, pos, options)
        .then(text => process.send(text))
        .catch(e => process.send((e && e.message) || 'Ошибка распознавания текста.'));
});