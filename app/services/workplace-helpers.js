const { BrowserWindow } = require('electron');
const path = require('path');
const throttle = require('lodash.throttle');
import { updateWorkplaces } from './events/helpers/update-workplaces';
import { WorkplaceWindow } from '../domains/workplace-window';

const createWorkplaceAreaWindow = (app, id, data) => {
    let props = {};
    if (data && data.rightBottomX) {
        props = {
            width: Math.abs(data.rightBottomX - data.leftTopX),
            height: Math.abs(data.rightBottomY - data.leftTopY),
            x: data.leftTopX,
            y: data.leftTopY
        }
    }

    let window = new BrowserWindow({
        width: 400,
        height: 100,
        skipTaskbar: true,
        titleBarStyle: 'hidden',
        toolbar: false,
        hasShadow: false,
        transparent: true,
        fullscreenable: false,
        resizable: true,
        alwaysOnTop: true,
        frame: false,
        show: true,
        ...props
    });
    window.setMenu(null);

    const updateWindow = throttle(() => {
        if (window) {
            const position = window.getPosition().map(position => Math.max(position, 0));
            const size = window.getSize().map(size => Math.max(size, 0));
            
            const data = {
                leftTopX: position[0],
                leftTopY: position[1],
                rightBottomX: (position[0] + size[0]),
                rightBottomY: (position[1] + size[1])
            };

            updateWorkplaces(app, workplaces => {
                if (workplaces[id]) {
                    workplaces[id].areaWindow = new WorkplaceWindow(data);
                }
    
                return Promise.resolve(workplaces);
            });
        }
    }, 500);
    window.on('resize', updateWindow);
    window.on('move', updateWindow);

    window.on('closed', e => hide(app, id));
    window.loadURL(`file://${path.resolve(__dirname, '../screens/workplace-area/workplace-area.html')}`);

    return window;
}

const createWorkplaceTranslateWindow = (app, id, data) => {
    let props = {};
    if (data && data.rightBottomX) {
        props = {
            width: Math.abs(data.rightBottomX - data.leftTopX),
            height: Math.abs(data.rightBottomY - data.leftTopY),
            x: data.leftTopX,
            y: data.leftTopY
        }
    }

    let window = new BrowserWindow({
        width: 600,
        height: 150,
        minHeight: 100,
        minWidth: 100,
        skipTaskbar: true,
        titleBarStyle: 'hidden',
        toolbar: false,
        hasShadow: false,
        transparent: true,
        fullscreenable: false,
        resizable: true,
        alwaysOnTop: true,
        frame: false,
        show: true,
        ...props
    });
    window.setMenu(null);

    window.webContents.once('dom-ready', () => {
        window.webContents.send('initialize', { id });
    });

    const updateWindow = throttle(() => {
        if (window) {
            const position = window.getPosition().map(position => Math.max(position, 0));
            const size = window.getSize().map(size => Math.max(size, 0));
            
            const data = {
                leftTopX: position[0],
                leftTopY: position[1],
                rightBottomX: (position[0] + size[0]),
                rightBottomY: (position[1] + size[1])
            };

            updateWorkplaces(app, workplaces => {
                if (workplaces[id]) {
                    workplaces[id].translateWindow = new WorkplaceWindow(data);
                }
    
                return Promise.resolve(workplaces);
            });
        }
    }, 500);
    window.on('resize', updateWindow);
    window.on('move', updateWindow);

    window.on('closed', e => hide(app, id));
    window.loadURL(`file://${path.resolve(__dirname, '../screens/workplace-translate/workplace-translate.html')}`);

    return window;
}

export const create = async (app, workplaceData, withWindows = true) => {
    workplaceData = workplaceData || {};
    
    const workplace = await ipcRenderer.sendSync('createWorkplace', workplaceData);

    if (withWindows) {
        createWindow(app, workplace);
    }

    return workplace;
}

export const createWindow = (app, workplace) => {
    const area = createWorkplaceAreaWindow(app, workplace.id, workplace.areaWindow);
    const translate = createWorkplaceTranslateWindow(app, workplace.id, workplace.translateWindow);

    return { area, translate };
};

export const closeWindow = ({ area, translate }) => {
    try {
        area.close();
    } catch (e) {}
    
    try {
        translate.close();
    } catch (e) {}
};

export const show = (app, id) => {
    updateWorkplaces(app, workplaces => {
        if (workplaces[id]) {
            workplaces[id].active = true;
        }

        if (!app.windows.workplaces[id]) {
            app.windows.workplaces[id] = createWindow(app, workplaces[id]);
        }

        const translateWindow = app.windows.workplaces[id].translate;
        translateWindow.send('textChange', workplaces[id].lastParsedText);

        return Promise.resolve(workplaces);
    });
};

export const hide = (app, id) => {
    updateWorkplaces(app, workplaces => {
        if (workplaces[id]) {
            workplaces[id].active = false;
        }

        const workplaceWindow = app.windows.workplaces[id];
        if (workplaceWindow) {
            closeWindow(workplaceWindow);
            delete app.windows.workplaces[id];
        }

        return Promise.resolve(workplaces);
    });
};