const { ipcMain, globalShortcut } = require('electron');
const { spawn } = require('child_process');
import { getVisibleAreaCoords } from './../services/get-visible-area-coords';
import { Store } from './store';
import { parseText } from './../services/parse-text';
import { Workplace } from './../domains/workplace';
import { WorkplaceWindow } from './../domains/workplace-window';
import { Lingualeo } from './lingualeo';
import { logger } from './../services/logger';

export class App {
    constructor() {
        this.store = new Store(true);
        this.tempStore = new Store(false);

        process.on('uncaughtException', error => logger.error(error));
        process.on('unhandledRejection', (reason, p) => logger.error(reason));
    }

    initialize(mainWindow) {
        this.mainWindow = mainWindow;

        this.registerEvents();
        this.registerShortcuts();
    }

    registerEvents() {
        ipcMain.on('leoLogin', async (event, { login, password }) => {
            this.store.set('leo.login', login);
            this.tempStore.set('leo.password', password);
            const result = await Lingualeo.login(login, password);
            this.mainWindow.send('leoLoginCompleted', result);
        });

        ipcMain.on('leoTranslate', async (event, text) => {
            const translatedItems = await Lingualeo.translate(text);
            event.sender.send('leoTranslateCompleted', translatedItems);
        });

        ipcMain.on('leoAddToDictionary', async (event, { text, translatedText }) => {
            const result = await Lingualeo.addToDictionary(text, translatedText);
            event.sender.send('leoAddToDictionaryCompleted', result);
        });

        ipcMain.on('parse', async (event, { id }) => await this.parseText());

        ipcMain.on('createWorkplace', (event, { id }) => {
            this.updateWorkplaces(workplaces => {
                const workplace = new Workplace({ id, active: true });
                workplaces[id] = workplace;

                return Promise.resolve(workplaces);
            });
        });
        
        ipcMain.on('changeWorkplaceArea', (event, { id, areaData }) => {
            this.updateWorkplaces(workplaces => {
                if (workplaces[id]) {
                    workplaces[id].area = new WorkplaceWindow(areaData);
                }

                return Promise.resolve(workplaces);
            });
        });
        
        ipcMain.on('changeWorkplaceText', (event, { id, textData }) => {
            this.updateWorkplaces(workplaces => {
                if (workplaces[id]) {
                    workplaces[id].text = new WorkplaceWindow(textData);
                }

                return Promise.resolve(workplaces);
            });
        });
        
        ipcMain.on('showWorkplace', (event, id) => {
            this.updateWorkplaces(workplaces => {
                if (workplaces[id]) {
                    workplaces[id].active = true;
                }

                return Promise.resolve(workplaces);
            });
        });
        
        ipcMain.on('hideWorkplace', (event, id) => {
            this.updateWorkplaces(workplaces => {
                if (workplaces[id]) {
                    workplaces[id].active = false;
                }

                return Promise.resolve(workplaces);
            });
        });
        
        ipcMain.on('removeWorkplace', (event, id) => {
            this.updateWorkplaces(workplaces => {
                const newWorkplaces = {};
                for (let workplaceId of Object.keys(workplaces)) {
                    if (workplaceId != id) {
                        newWorkplaces[workplaceId] = workplaces[workplaceId];
                    }
                }
                this.mainWindow.webContents.send('removeWorkplace', id);

                return Promise.resolve(newWorkplaces);
            });
        });
        
        ipcMain.on('textColorChange', (event, { id, textColor }) => {
            this.updateWorkplaces(workplaces => {
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
            this.updateWorkplaces(workplaces => {
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
            this.updateWorkplaces(workplaces => {
                if (workplaces[id]) {
                    if (!workplaces[id].imageCleaner) {
                        workplaces[id].imageCleaner = {};
                    }

                    workplaces[id].imageCleaner.diffErrorDelta = diffErrorDelta;
                }

                return Promise.resolve(workplaces);
            });
        });
    }

    registerShortcuts() {
        globalShortcut.register('Alt+R', async () => await this.parseText());
    }

    async updateWorkplaces(updateCallback) {
        const workplaces = this.store.get('workplaces') || {};
        const changedWorkplaces = await updateCallback(workplaces);
        this.store.set(`workplaces`, changedWorkplaces);

        if (this.mainWindow) {
            this.mainWindow.webContents.send('workplacesUpdate', Object.values(this.store.get('workplaces') || []));
        }
    }

    async parseText() {
        const workplaces = Object.values(this.store.get('workplaces') || []);
        for (let workplace of workplaces) {
            if (!workplace.active) {
                return;
            }

            let text = ''
            try {
                text = await parseText(getVisibleAreaCoords(workplace.area), {
                    imageCleaner: workplace.imageCleaner
                });
            } catch (e) {
                text = 'Ошибка распознавания текста.';
            }
            workplace = this.store.get(`workplaces.${workplace.id}`);

            if (workplace && text) {
                workplace.lastParsedText = text;
                this.store.set(`workplaces.${workplace.id}`, workplace);

                if (this.mainWindow) {
                    this.mainWindow.webContents.send('workplacesUpdate', Object.values(this.store.get('workplaces') || []));
                }
            }
        }
    }
}