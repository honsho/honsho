const { ipcMain } = require('electron');
import { Workplace } from './../../domains/workplace';
import { WorkplaceWindow } from './../../domains/workplace-window';
import { Lingualeo } from './../lingualeo';
import { updateWorkplaces } from './helpers/update-workplaces';
import { createWindow, closeWindow } from '../workplace-helpers';
import { show, hide } from './../../services/workplace-helpers';

export default app => {
    ipcMain.on('createWorkplace', (event, data = {}) => {
        if (typeof data.id === 'undefined') {
            const maxId = Math.max(...Object.keys(app.store.get('workplaces') || { 0: true }));
            data.id = Number.isFinite(maxId) ? (maxId + 1) : 1;
        }
        data.active = true;

        event.returnValue = new Promise(resolve => {
            updateWorkplaces(app, workplaces => {
                workplaces[data.id] = new Workplace(data);
                return Promise.resolve(workplaces);
            }, workplaces => {
                resolve(workplaces[data.id]);

                if (!app.windows.workplaces[data.id]) {
                    app.windows.workplaces[data.id] = createWindow(app, workplaces[data.id]);
                }
            });
        });
    });

    ipcMain.on('removeWorkplace', (event, id) => {
        updateWorkplaces(app, workplaces => {
            const newWorkplaces = {};
            for (let workplaceId of Object.keys(workplaces)) {
                if (workplaceId != id) {
                    newWorkplaces[workplaceId] = workplaces[workplaceId];
                }
            }

            const workplaceWindow = app.windows.workplaces[id]
            if (workplaceWindow) {
                closeWindow(workplaceWindow);
                delete app.windows.workplaces[id];
            }

            return Promise.resolve(newWorkplaces);
        });
    });

    ipcMain.on('showWorkplace', (event, id) => show(app, id));
    ipcMain.on('hideWorkplace', (event, id) => hide(app, id));

    ipcMain.on('saveWorkplaceSettings', (event, data) => {
        updateWorkplaces(app, workplaces => {
            const workplace = workplaces[data.id];
            if (workplace) {
                workplace.name = data.name;
                workplace.translateByClicK = data.translateByClicK;
                workplace.hideByTitleClick = data.hideByTitleClick;
                workplace.imageCleaner = data.imageCleaner;
            }

            return Promise.resolve(workplaces);
        });
    });
};