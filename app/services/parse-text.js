const { app, remote } = require('electron');
const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');
const parser = fork('./app/modules/text-parser/text-parser.js');
import { getCoordsFromAreaWindow } from './get-coords-from-area-window';

export const parseText = ({ leftTopX, leftTopY, rightBottomX, rightBottomY }, options = {}) => {
    return new Promise(resolve => {
        const imageHash = Date.now() + Math.floor(Math.random() * 1000);
        const imagePath = path.join((app || remote.app).getPath('userData'), `/temp-image-${imageHash}.png`);

        parser.once('message', text => {
            text = text.replace(/\s/g, ' ');
            text = text || 'Ошибка распознавания текста.';

            resolve(text);
        });
        parser.send({ imagePath, pos: { leftTopX, leftTopY, rightBottomX, rightBottomY }, options });
    });
};

export const parseTextAndUpdateWorkplaces = async (app, id = null) => {
    let workplaces = app.store.get('workplaces') || {};
    if (workplaces[id]) {
        workplaces = [workplaces[id]];
    } else {
        workplaces = Object.values(workplaces);
    }

    for (let workplace of workplaces) {
        if (!workplace.active) {
            return;
        }

        const text = await parseText(getCoordsFromAreaWindow(workplace.areaWindow), {
            imageCleaner: workplace.imageCleaner
        });
        workplace = app.store.get(`workplaces.${workplace.id}`);

        if (workplace && text) {
            workplace.lastParsedText = text;
            app.store.set(`workplaces.${workplace.id}`, workplace);

            if (app.windows.workplaces[workplace.id] && app.windows.workplaces[workplace.id].translate) {
                app.windows.workplaces[workplace.id].translate.send('textChange', workplace.lastParsedText);
            }

            const newWorkplaces = Object.values(app.store.get('workplaces') || {});
            app.windows.main.webContents.send('workplacesUpdate', newWorkplaces);
        }
    }
}