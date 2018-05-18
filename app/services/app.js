const { ipcMain, globalShortcut } = require('electron');
const { spawn } = require('child_process');
import { Store } from './store';
import { Lingualeo } from './lingualeo';
import { parseTextAndUpdateWorkplaces } from './../services/parse-text';
import { logger } from './../services/logger';
import settingsEvents from './../services/events/settings';
import windowsEvents from './../services/events/windows';
import leoEvents from './../services/events/leo';
import parserEvents from './../services/events/parser';
import workplaceEvents from './../services/events/workplace';
import { createWindow } from './workplace-helpers';

export class App {
    constructor() {
        this.store = new Store(true);

        process.on('uncaughtException', error => logger.error(error));
        process.on('unhandledRejection', (reason, p) => logger.error(reason));
    }

    initialize(mainWindow) {
        this.updateStoreData();
        this.createWindows(mainWindow);
        this.login();

        this.registerEvents();
        this.registerShortcuts();
    }

    updateStoreData() {
        const workplaces = this.store.get('workplaces') || {};
        for (let n in workplaces) {
            workplaces[n].lastParsedText = '';
            workplaces[n].active = false;
        }

        this.store.set(`workplaces`, workplaces);
    }

    createWindows(main) {
        main.on('closed', e => delete this.windows.main);

        const workplaces = Object.values(this.store.get('workplaces') || {});
        const workplacesWindows = {};
        workplaces.forEach(workplace => {
            if (workplace.active) {
                const window = createWindow(this, workplace);
                workplacesWindows[workplace.id] = window;
            }
        });

        this.windows = {
            main,
            workplaces: workplacesWindows
        };
    }

    async login() {
        const { login, password } = this.store.get('leo') || {};
        if (login && password) {
            const result = await Lingualeo.login(login, password);
            this.windows.main.send('leoLoginCompleted', result);
        }
    }

    registerEvents() {
        settingsEvents(this);
        windowsEvents(this);
        leoEvents(this);
        parserEvents(this);
        workplaceEvents(this);
    }

    registerShortcuts() {
        globalShortcut.register('Alt+R', () => parseTextAndUpdateWorkplaces(this));
    }
}