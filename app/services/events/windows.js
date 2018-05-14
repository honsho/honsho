const { ipcMain } = require('electron');
import { Workplace } from './../../domains/workplace';
import { WorkplaceWindow } from './../../domains/workplace-window';
import { Lingualeo } from './../lingualeo';
import { updateWorkplaces } from './helpers/update-workplaces';
import { createWindow, closeWindow } from '../workplace-helpers';
import { show, hide } from './../../services/workplace-helpers';

export default app => {
    ipcMain.on('mainWindowInit', event => {
        const workplaces = Object.values(app.store.get('workplaces') || {});
        event.returnValue = { workplaces };
    });
};