const { ipcMain } = require('electron');

export default app => {
    ipcMain.on('mainWindowInit', event => {
        const workplaces = app.store.get('workplaces') || {};
        const workplaceGroups = app.store.get('workplaceGroups') || {};

        event.returnValue = { workplaces, workplaceGroups };
    });
};