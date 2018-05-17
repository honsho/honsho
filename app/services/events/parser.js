const { ipcMain } = require('electron');
import { Lingualeo } from './../lingualeo';
import { parseTextAndUpdateWorkplaces } from './../../services/parse-text';
import { updateWorkplaces } from './helpers/update-workplaces';

export default app => {
    ipcMain.on('parse', async (event, { id }) => await parseTextAndUpdateWorkplaces(app, id));

    ipcMain.on('textColorChange', (event, { id, textColor }) => {
        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            if (workplaces[id]) {
                if (!workplaces[id].imageCleaner) {
                    workplaces[id].imageCleaner = {};
                }

                workplaces[id].imageCleaner.textColor = textColor;
            }

            return { workplaces, workplaceGroups };
        });
    });

    ipcMain.on('basicErrorDeltaChange', (event, { id, basicErrorDelta }) => {
        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            if (workplaces[id]) {
                if (!workplaces[id].imageCleaner) {
                    workplaces[id].imageCleaner = {};
                }

                workplaces[id].imageCleaner.basicErrorDelta = basicErrorDelta;
            }

            return { workplaces, workplaceGroups };
        });
    });

    ipcMain.on('diffErrorDeltaChange', (event, { id, diffErrorDelta }) => {
        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            if (workplaces[id]) {
                if (!workplaces[id].imageCleaner) {
                    workplaces[id].imageCleaner = {};
                }

                workplaces[id].imageCleaner.diffErrorDelta = diffErrorDelta;
            }

            return { workplaces, workplaceGroups };
        });
    });
};