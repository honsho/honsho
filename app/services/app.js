const { ipcMain, globalShortcut } = require('electron');
const { spawn } = require('child_process');
import { Store } from './store';
import { Lingualeo } from './lingualeo';
import { parseAndUpdateWorkplaces } from './../services/parse-text';
import { logger } from './../services/logger';
import leoEvents from './../services/events/leo';
import parserEvents from './../services/events/parser';
import workplaceEvents from './../services/events/workplace';

export class App {
    constructor() {
        this.store = new Store(true);

        process.on('uncaughtException', error => logger.error(error));
        process.on('unhandledRejection', (reason, p) => logger.error(reason));
    }

    initialize(mainWindow) {
        this.mainWindow = mainWindow;

        this.login();

        this.registerEvents();
        this.registerShortcuts();
    }

    async login() {
        const result = await Lingualeo.login(this.store.get('leo.login'), this.store.get('leo.password'));
        this.mainWindow.send('leoLoginCompleted', result);
    }

    registerEvents() {
        leoEvents(this);
        parserEvents(this);
        workplaceEvents(this);
    }

    registerShortcuts() {
        globalShortcut.register('Alt+R', async () => await parseAndUpdateWorkplaces(this));
    }
}