const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
import { App } from './services/app';
import { isProd } from './services/is-prod';

const createWindow = () => {
    const mainWindow = new BrowserWindow({ width: 500, height: 500, show: false });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/../app/screens/main/main.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    if (isProd()) {
        mainWindow.setMenu(null);
    }

    const application = new App();
    application.initialize(mainWindow);

    mainWindow.on('ready-to-show', () => { 
        mainWindow.show(); 
        mainWindow.focus(); 
    });

    mainWindow.webContents.once('dom-ready', () => {
        const workplaces = Object.values(application.store.get('workplaces') || {});
        workplaces.forEach(workplace => {
            workplace.lastParsedText = '';
            application.store.set(`workplaces.${workplace.id}`, workplace);
        });

        const leoInfo = application.store.get('leo') || {};

        mainWindow.webContents.send('initialize', { workplaces, leoInfo });
    });

    mainWindow.on('closed', () => app.quit());
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());