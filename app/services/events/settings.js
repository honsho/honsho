const { ipcMain } = require('electron');

export default app => {
    ipcMain.on('getSettings', event => {
        const leo = app.store.get('leo') || {};
        event.returnValue = { leo };
    });
};