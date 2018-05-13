const { ipcMain } = require('electron');
import { Workplace } from './../../domains/workplace';
import { WorkplaceWindow } from './../../domains/workplace-window';
import { Lingualeo } from './../lingualeo';
import { updateWorkplaces } from './../update-workplaces';

export default app => {
    ipcMain.on('createWorkplace', (event, data = {}) => {
        updateWorkplaces(app, workplaces => {
            if (typeof data.id === 'undefined') {
                const maxId = Math.max(...Object.keys(app.store.get('workplaces') || { 0: true }));
                data.id = Number.isFinite(maxId) ? (maxId + 1) : 1;
            }
            data.active = true;

            workplaces[data.id] = new Workplace(data);

            return Promise.resolve(workplaces);
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

            app.mainWindow.webContents.send('removeWorkplace', id);
            return Promise.resolve(newWorkplaces);
        });
    });

    ipcMain.on('changeWorkplaceArea', (event, { id, areaData }) => {
        updateWorkplaces(app, workplaces => {
            if (workplaces[id]) {
                workplaces[id].area = new WorkplaceWindow(areaData);
            }

            return Promise.resolve(workplaces);
        });
    });
    
    ipcMain.on('changeWorkplaceText', (event, { id, textData }) => {
        updateWorkplaces(app, workplaces => {
            if (workplaces[id]) {
                workplaces[id].text = new WorkplaceWindow(textData);
            }

            return Promise.resolve(workplaces);
        });
    });

    ipcMain.on('showWorkplace', (event, id) => {
        updateWorkplaces(app, workplaces => {
            if (workplaces[id]) {
                workplaces[id].active = true;
            }

            return Promise.resolve(workplaces);
        });
    });
    
    ipcMain.on('hideWorkplace', (event, id) => {
        updateWorkplaces(app, workplaces => {
            if (workplaces[id]) {
                workplaces[id].active = false;
            }

            return Promise.resolve(workplaces);
        });
    });
};