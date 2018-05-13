export const updateWorkplaces = async (app, updateAction) => {
    const workplaces = app.store.get('workplaces') || {};
    const changedWorkplaces = await updateAction(workplaces);
    app.store.set(`workplaces`, changedWorkplaces);
    
    app.mainWindow.webContents.send('workplacesUpdate', Object.values(changedWorkplaces));
}