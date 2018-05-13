const { ipcRenderer, remote } = require('electron');
const path = require('path');
const throttle = require('lodash.throttle');

const createWorkplaceAreaWindow = (id, areaData) => {
    let props = {};
    if (areaData && areaData.rightBottomX) {
        props = {
            width: Math.abs(areaData.rightBottomX - areaData.leftTopX),
            height: Math.abs(areaData.rightBottomY - areaData.leftTopY),
            x: areaData.leftTopX,
            y: areaData.leftTopY
        }
    }

    let area = new remote.BrowserWindow({
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
    area.setMenu(null);

    const updateWindow = throttle(() => {
        if (area) {
            const position = area.getPosition().map(position => Math.max(position, 0));
            const size = area.getSize().map(size => Math.max(size, 0));
            
            const areaData = {
                leftTopX: position[0],
                leftTopY: position[1],
                rightBottomX: (position[0] + size[0]),
                rightBottomY: (position[1] + size[1])
            };

            ipcRenderer.send('changeWorkplaceArea', { id, areaData });
        }
    }, 500);
    area.on('resize', updateWindow);
    area.on('move', updateWindow);

    area.on('closed', e => ipcRenderer.send('removeWorkplace', id));
    area.loadURL(`file://${path.resolve(__dirname, '../screens/workplace-area/workplace-area.html')}`);

    return area;
}

const createWorkplaceTextWindow = (id, textData) => {
    let props = {};
    if (textData && textData.rightBottomX) {
        props = {
            width: Math.abs(textData.rightBottomX - textData.leftTopX),
            height: Math.abs(textData.rightBottomY - textData.leftTopY),
            x: textData.leftTopX,
            y: textData.leftTopY
        }
    }

    let text = new remote.BrowserWindow({
        width: 800,
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
    text.setMenu(null);

    text.webContents.once('dom-ready', () => {
        text.webContents.send('initialize', { id });
    });

    const updateWindow = throttle(() => {
        if (text) {
            const position = text.getPosition().map(position => Math.max(position, 0));
            const size = text.getSize().map(size => Math.max(size, 0));
            
            const textData = {
                leftTopX: position[0],
                leftTopY: position[1],
                rightBottomX: (position[0] + size[0]),
                rightBottomY: (position[1] + size[1])
            };
            
            ipcRenderer.send('changeWorkplaceText', { id, textData });
        }
    }, 500);
    text.on('resize', updateWindow);
    text.on('move', updateWindow);

    text.on('closed', e => ipcRenderer.send('removeWorkplace', id));
    text.loadURL(`file://${path.resolve(__dirname, '../screens/workplace-text/workplace-text.html')}`);

    return text;
}


export const createWorkplace = (app, workplaceData) => {
    workplaceData = workplaceData || {};

    const generatedId = Math.max(...Object.keys(app.store.get('workplaces') || { 0: true })) + 1;
    const id = typeof workplaceData.id !== 'undefined' ? workplaceData.id : generatedId ;
    
    ipcRenderer.send('createWorkplace', { id });

    if (workplace.id) {
        id = workplace.id;
    } else {
        const ids = workplaces.map(workplace => +workplace.id).sort();
        id = ids.length ? (ids[ids.length - 1] + 1) : 1;
        ipcRenderer.send('createWorkplace', { id });
    }

    const area = createWorkplaceAreaWindow(id, workplace.area);
    const text = createWorkplaceTextWindow(id, workplace.text);

    return { id, area, text };
}

export const createWorkplaceWindows = (workplace) => {
    const area = createWorkplaceAreaWindow(workplace.id, workplace.area);
    const text = createWorkplaceTextWindow(workplace.id, workplace.text);

    return { id: workplace.id, area, text };
}