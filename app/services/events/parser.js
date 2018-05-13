const { ipcMain } = require('electron');
import { Lingualeo } from './../lingualeo';
import { parseAndUpdateWorkplaces } from './../../services/parse-text';
import { updateWorkplaces } from './../update-workplaces';

export default app => {
    ipcMain.on('parse', async (event, { id }) => await parseAndUpdateWorkplaces(app, id));

    ipcMain.on('textColorChange', (event, { id, textColor }) => {
        updateWorkplaces(app, workplaces => {
            if (workplaces[id]) {
                if (!workplaces[id].imageCleaner) {
                    workplaces[id].imageCleaner = {};
                }

                workplaces[id].imageCleaner.textColor = textColor;
            }

            return Promise.resolve(workplaces);
        });
    });

    ipcMain.on('basicErrorDeltaChange', (event, { id, basicErrorDelta }) => {
        updateWorkplaces(app, workplaces => {
            if (workplaces[id]) {
                if (!workplaces[id].imageCleaner) {
                    workplaces[id].imageCleaner = {};
                }

                workplaces[id].imageCleaner.basicErrorDelta = basicErrorDelta;
            }

            return Promise.resolve(workplaces);
        });
    });

    ipcMain.on('diffErrorDeltaChange', (event, { id, diffErrorDelta }) => {
        updateWorkplaces(app, workplaces => {
            if (workplaces[id]) {
                if (!workplaces[id].imageCleaner) {
                    workplaces[id].imageCleaner = {};
                }

                workplaces[id].imageCleaner.diffErrorDelta = diffErrorDelta;
            }

            return Promise.resolve(workplaces);
        });
    });
};