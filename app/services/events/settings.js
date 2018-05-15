const { ipcMain } = require('electron');
import { Workplace } from './../../domains/workplace';
import { WorkplaceWindow } from './../../domains/workplace-window';
import { WorkplaceGroup } from '../../domains/workplace-group';
import { Lingualeo } from './../lingualeo';
import { updateWorkplaces } from './helpers/update-workplaces';
import { createWindow, closeWindow } from '../workplace-helpers';
import { show, hide } from './../../services/workplace-helpers';

export default app => {
    ipcMain.on('getSettings', event => {
        const leo = app.store.get('leo') || {};
        event.returnValue = { leo };
    });
};