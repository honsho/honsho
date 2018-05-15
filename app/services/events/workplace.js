const { ipcMain } = require('electron');
import { Workplace } from './../../domains/workplace';
import { WorkplaceWindow } from './../../domains/workplace-window';
import { WorkplaceGroup } from '../../domains/workplace-group';
import { Lingualeo } from './../lingualeo';
import { updateWorkplaces } from './helpers/update-workplaces';
import { createWindow, closeWindow } from '../workplace-helpers';
import { show, hide } from './../../services/workplace-helpers';

export default app => {
    ipcMain.on('createWorkplaceGroup', (event, data = {}) => {
        const workplaceGroups = app.store.get('workplace-groups') || {};

        const maxId = Math.max(...Object.keys(workplaceGroups || { 0: true }));
        data.id = Number.isFinite(maxId) ? (maxId + 1) : 1;

        workplaceGroups[data.id] = new WorkplaceGroup(data);

        app.store.set('workplace-groups', workplaceGroups);
        updateWorkplaces(app, workplaces => Promise.resolve(workplaces));

        event.returnValue = workplaceGroups[data.id];
    });

    ipcMain.on('removeWorkplaceGroup', (event, id) => {
        let workplaceGroups = app.store.get('workplace-groups') || {};
        const workplaceGroup = workplaceGroups[id];

        if (workplaceGroup) {
            updateWorkplaces(app, workplaces => {
                const idsToDelete = workplaceGroup.workplaces.map(workplace => workplace.id);

                idsToDelete.forEach(id => {
                    delete workplaces[id];

                    const workplaceWindow = app.windows.workplaces[id];
                    if (workplaceWindow) {
                        closeWindow(workplaceWindow);
                        delete app.windows.workplaces[id];
                    }
                });

                return Promise.resolve(workplaces);
            });

            delete workplaceGroups[id];
            app.store.set('workplace-groups', workplaceGroups);
        }
    });

    ipcMain.on('createWorkplace', (event, data = {}) => {
        if (!data.groupId) {
            return event.returnValue = null;
        }

        const maxId = Math.max(...Object.keys(app.store.get('workplaces') || { 0: true }));
        data.id = Number.isFinite(maxId) ? (maxId + 1) : 1;
        data.active = true;

        const workplaceGroups = app.store.get('workplace-groups');
        let workplaceGroup = workplaceGroups[data.groupId];
        if (!workplaceGroup) {
            workplaceGroup = new WorkplaceGroup({ id: data.groupId, title: (data.title || 'Пустой заголовок') });
            workplaceGroups[data.groupId] = workplaceGroup;
        }
        workplaceGroup.workplacesIds.push(data.id);
        app.store.set('workplace-groups', workplaceGroups);

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
            delete workplaces[id];

            const workplaceWindow = app.windows.workplaces[id]
            if (workplaceWindow) {
                closeWindow(workplaceWindow);
                delete app.windows.workplaces[id];
            }

            return Promise.resolve(workplaces);
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