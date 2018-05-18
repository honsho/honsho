const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

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

const clean = async ({ png, imagePath, textColor, basicErrorDelta, diffErrorDelta }) => {
    if (!textColor) {
        throw new Error();
    }
    basicErrorDelta = basicErrorDelta || 0;
    diffErrorDelta = diffErrorDelta || 0;

    const isWantedColor = (color) => areColorsEqual(color, textColor, diffErrorDelta);

    const startPoints = [];
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const color = getColorAtPoint(png, x, y);

            if (areColorsEqual(color, textColor, basicErrorDelta)) {
                startPoints.push({ x, y });
            }
        }
    }

    const visitedPoints = [];

    startPoints.forEach((startPoint, i) => {
        const pixelStack = [startPoint];
        
        while (pixelStack.length) {
            let { x, y } = pixelStack.pop();

            if (visitedPoints[`${x},${y}`]) {
                continue;        
            }
            visitedPoints[`${x},${y}`] = true;

            while (y >= 0 && isWantedColor(getColorAtPoint(png, x, (y - 1)))) {
                y -= 1;
            }

            let reachLeft = false;
            let reachRight = false;

            while (y <= png.height && isWantedColor(getColorAtPoint(png, x, y))) {
                setColorAtPoint(png, x, y, textColor);

                // Смотрим налево
                if (x > 0) {
                    const leftPixelColor = getColorAtPoint(png, x - 1, y);
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
                if (x < png.width) {
                    const rightPixelColor = getColorAtPoint(png, x + 1, y);
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

    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const color = getColorAtPoint(png, x, y);
            const isPrimaryColor = areColorsEqual(color, textColor);

            generalizeColor(png, x, y, isPrimaryColor ? 'primary' : 'secondary');
        }
    }

    return png;
}

module.exports = async data => {
    try {
        return await clean(data);
    } catch (e) {
        return null;
    }
};