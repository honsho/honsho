const { app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');
const parser = fork('./app/modules/text-parser/text-parser.js');
import { getCoordsFromAreaWindow } from './get-coords-from-area-window';

export const parseText = (image, { leftTopX, leftTopY, rightBottomX, rightBottomY }, options = {}) => {
    return new Promise(resolve => {
        const imageHash = Date.now() + Math.floor(Math.random() * 1000);
        const imagePath = path.join(app.getPath('userData'), `/temp-image-${imageHash}.png`);

        parser.once('message', text => {
            text = text.replace(/\s/g, ' ');
            text = text || 'Ошибка распознавания текста.';

            resolve(text);
        });
        parser.send({ imagePath, image, pos: { leftTopX, leftTopY, rightBottomX, rightBottomY }, options });
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

        const workplaceWindows = app.windows.workplaces[workplace.id];
        if (workplaceWindows && workplaceWindows.area) {
            workplaceWindows.area.send('parseStarted');
        }
    }

    const screenshot = await new Promise(resolve => {
        ipcMain.once('screenshotCreated', (event, screenshot) => resolve(screenshot));
        app.windows.main && app.windows.main.send('createScreenshot');
    });

    for (let workplace of workplaces) {
        if (!workplace.active) {
            return;
        }

        parseText(screenshot, getCoordsFromAreaWindow(workplace.areaWindow), {
            imageCleaner: workplace.imageCleaner
        }).then(text => {
            workplace = app.store.get(`workplaces.${workplace.id}`);
            if (workplace && text) {
                workplace.lastParsedText = text;
                app.store.set(`workplaces.${workplace.id}`, workplace);

                workplaces = app.store.get('workplaces') || {};
                const workplaceGroups = app.store.get('workplaceGroups') || {};

                const responseMessage = { workplaces, workplaceGroups };
                
                app.windows.main.webContents.send('workplacesUpdate', responseMessage);
                const workplaceWindows = app.windows.workplaces[workplace.id];
                if (workplaceWindows && workplaceWindows.translate) {
                    workplaceWindows.translate.send('workplacesUpdate', responseMessage);
                }
            }
        });
    }
}