const { app, remote } = require('electron');
const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');
const parser = fork('./app/modules/text-parser/text-parser.js');

export const parseText = ({ leftTopX, leftTopY, rightBottomX, rightBottomY }, options = {}) => {
    return new Promise(resolve => {
        const imageHash = Date.now() + Math.floor(Math.random() * 1000);
        const imagePath = path.join((app || remote.app).getPath('userData'), `/temp-image-${imageHash}.png`);

        console.log('parseText', { leftTopX, leftTopY, rightBottomX, rightBottomY }, options);

        parser.once('message', text => {
            resolve(text.replace(/\s/g, ' '));
        });
        parser.send({ imagePath, pos: { leftTopX, leftTopY, rightBottomX, rightBottomY }, options });
    });
};