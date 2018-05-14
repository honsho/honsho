export const updateWorkplaces = async (app, updateAction, onComplete) => {
    const workplaces = app.store.get('workplaces') || {};
    let changedWorkplaces = await updateAction(workplaces);
    app.store.set(`workplaces`, changedWorkplaces);
    
    onComplete && onComplete(changedWorkplaces);
    changedWorkplaces = Object.values(changedWorkplaces);

    app.windows.main && app.windows.main.webContents.send('workplacesUpdate', changedWorkplaces);
    for (let workplaceData of Object.values(app.windows.workplaces)) {
        workplaceData.translate && workplaceData.translate.send('workplacesUpdate', changedWorkplaces);
    }
}