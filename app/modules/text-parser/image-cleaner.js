const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const sharp = require('sharp');

const getColorAtPoint = (imageInfo, x, y) => {
    const idx = (imageInfo.width * y + x) << 2;
    return { r: imageInfo.data[idx], g: imageInfo.data[idx + 1], b: imageInfo.data[idx + 2] };
}

const setColorAtPoint = (imageInfo, x, y, color) => {
    const idx = (imageInfo.width * y + x) << 2;

    imageInfo.data[idx] = color.r;
    imageInfo.data[idx+1] = color.g;
    imageInfo.data[idx+2] = color.b;
    imageInfo.data[idx+3] = 255; // alpha
}

const generalizeColor = (imageInfo, x, y, colorType = 'primary') => {
    const primaryColor = { r: 0, g: 0, b: 0 };
    const secondaryColor = { r: 255, g: 255, b: 255 };

    setColorAtPoint(imageInfo, x, y, (colorType === 'primary') ? primaryColor : secondaryColor);
}

const areColorsEqual = (color1, color2, errorDelta = 0) => {
    return ['r', 'g', 'b'].every(c => Math.abs(color1[c] - color2[c]) <= errorDelta);
}

const clean = ({ imagePath, textColor, basicErrorDelta, diffErrorDelta }) => {
    if (!textColor) {
        return Promise.resolve();
    }
    basicErrorDelta = basicErrorDelta || 0;
    diffErrorDelta = diffErrorDelta || 0;

    return new Promise((resolve, reject) => {
        const isWantedColor = (color) => areColorsEqual(color, textColor, diffErrorDelta);

        fs.createReadStream(imagePath)
            .pipe(new PNG())
            .on('parsed', function() {
                const startPoints = [];
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        const color = getColorAtPoint(this, x, y);

                        if (areColorsEqual(color, textColor, basicErrorDelta)) {
                            startPoints.push({ x, y });
                        }
                    }
                }

                const visitedPoints = [];

                startPoints.forEach(startPoint => {
                    const pixelStack = [startPoint];
                    
                    while (pixelStack.length) {
                        let { x, y } = pixelStack.pop();

                        if (visitedPoints[`${x},${y}`]) {
                            continue;        
                        }
                        visitedPoints[`${x},${y}`] = true;

                        while (y >= 0 && isWantedColor(getColorAtPoint(this, x, (y - 1)))) {
                            y -= 1;
                        }

                        let reachLeft = false;
                        let reachRight = false;

                        while (y <= this.height && isWantedColor(getColorAtPoint(this, x, y))) {
                            setColorAtPoint(this, x, y, textColor);

                            // Смотрим налево
                            if (x > 0) {
                                const leftPixelColor = getColorAtPoint(this, x - 1, y);
                                if (isWantedColor(leftPixelColor)) {
                                    if (!reachLeft) {
                                        pixelStack.push({ x: (x - 1), y });
                                        reachLeft = true;
                                    }
                                } else if (reachLeft) {
                                    reachLeft = false;
                                }
                            }

                            // Смотрим направо
                            if (x < this.width) {
                                const rightPixelColor = getColorAtPoint(this, x + 1, y);
                                if (isWantedColor(rightPixelColor)) {
                                    if (!reachRight) {
                                        pixelStack.push({ x: (x + 1), y });
                                        reachRight = true;
                                    }
                                } else if (reachRight) {
                                    reachRight = false;
                                }
                            }

                            y += 1;
                        }
                    }
                });

                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        const color = getColorAtPoint(this, x, y);
                        const isPrimaryColor = areColorsEqual(color, textColor);

                        generalizeColor(this, x, y, isPrimaryColor ? 'primary' : 'secondary');
                    }
                }

                const resizer = sharp().resize(this.width * 3, this.height * 3).png();
                const writeStream = this.pack().pipe(resizer).pipe(fs.createWriteStream(imagePath));
                writeStream.on('finish', () => resolve());
                writeStream.on('error', () => reject());
            });
    });
}

module.exports = async ({ imagePath, textColor, basicErrorDelta, diffErrorDelta }) => {
    try {
        await clean({ imagePath, textColor, basicErrorDelta, diffErrorDelta })
        return true;
    } catch (e) {
        return false;
    }
};