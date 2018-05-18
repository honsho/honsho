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
        let createdWorkplaceGroup;

        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            const maxId = Math.max(...Object.keys(workplaceGroups).concat(0));
            data.id = Number.isFinite(maxId) ? (maxId + 1) : 1;

            workplaceGroups[data.id] = new WorkplaceGroup(data);
            createdWorkplaceGroup = workplaceGroups[data.id];

            return { workplaces, workplaceGroups };
        });

        event.returnValue = createdWorkplaceGroup;
    });

    ipcMain.on('removeWorkplaceGroup', (event, id) => {
        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            const workplaceGroup = workplaceGroups[id];
            if (workplaceGroup) {
                workplaceGroup.workplacesIds.forEach(id => {
                    delete workplaces[id];

                    const workplaceWindow = app.windows.workplaces[id];
                    if (workplaceWindow) {
                        closeWindow(workplaceWindow);
                        delete app.windows.workplaces[id];
                    }
                });
            }

            delete workplaceGroups[id];

            return { workplaces, workplaceGroups };
        });
    });

    ipcMain.on('createWorkplace', (event, data = {}) => {
        if (!data.groupId) {
            return event.returnValue = null;
        }

        let createdWorkplace;

        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            const maxId = Math.max(...Object.keys(workplaces).concat(0));
            data.id = Number.isFinite(maxId) ? (maxId + 1) : 1;
            data.active = true;

            workplaces[data.id] = new Workplace(data);
            createdWorkplace = workplaces[data.id];

            let workplaceGroup = workplaceGroups[data.groupId];
            if (!workplaceGroup) {
                workplaceGroup = new WorkplaceGroup({ id: data.groupId, title: (data.title || 'Пустой заголовок') });
                workplaceGroups[data.groupId] = workplaceGroup;
            }
            workplaceGroup.workplacesIds.push(data.id);

            return { workplaces, workplaceGroups };
        }, (workplaces, workplaceGroups) => {
            if (!app.windows.workplaces[data.id]) {
                app.windows.workplaces[data.id] = createWindow(app, workplaces[data.id]);
            }
        });

        event.returnValue = createdWorkplace;
    });

    ipcMain.on('removeWorkplace', (event, id) => {
        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            const workplace = workplaces[id];
            if (workplace) {
                const workplaceGroup = workplaceGroups[workplace.groupId];
                if (workplaceGroup) {
                    workplaceGroup.workplacesIds = workplaceGroup.workplacesIds.filter(id => id != workplace.id);
                }
            }

            delete workplaces[id];

            const workplaceWindow = app.windows.workplaces[id];
            if (workplaceWindow) {
                closeWindow(workplaceWindow);
                delete app.windows.workplaces[id];
            }

            return { workplaces, workplaceGroups };
        });
    });

    ipcMain.on('showWorkplace', (event, id) => show(app, id));
    ipcMain.on('hideWorkplace', (event, id) => hide(app, id));

    ipcMain.on('saveWorkplaceSettings', (event, data) => {
        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            const workplace = workplaces[data.id];
            if (workplace) {
                workplace.title = data.title;
                workplace.parseByAreaClick = data.parseByAreaClick;
                workplace.translateByTextSelect = data.translateByTextSelect;
                workplace.hideByTitleClick = data.hideByTitleClick;
                workplace.imageCleaner = data.imageCleaner;
            }

            return { workplaces, workplaceGroups };
        });
    });

    ipcMain.on('saveWorkplaceGroupSettings', (event, data) => {
        updateWorkplaces(app, (workplaces, workplaceGroups) => {
            const workplaceGroup = workplaceGroups[data.id];
            if (workplaceGroup) {
                workplaceGroup.title = data.title;
            }

            return { workplaces, workplaceGroups };
        });
    });
};