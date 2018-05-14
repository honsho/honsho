export const updateWorkplaces = async (app, updateAction, onComplete) => {
    const workplaces = app.store.get('workplaces') || {};
    const changedWorkplaces = await updateAction(workplaces);
    app.store.set(`workplaces`, changedWorkplaces);
    
    onComplete && onComplete(changedWorkplaces);
    app.windows.main && app.windows.main.webContents.send('workplacesUpdate', Object.values(changedWorkplaces));
}