export const updateWorkplaces = async (app, updateAction, onComplete) => {
    const workplaces = app.store.get('workplaces') || {};
    const workplaceGroups = app.store.get('workplace-groups') || {};

    let changedWorkplaces = await updateAction(workplaces);
    app.store.set(`workplaces`, changedWorkplaces);
    
    onComplete && onComplete(changedWorkplaces);
    changedWorkplaces = Object.values(changedWorkplaces);

    const responseMessage = { workplaces: changedWorkplaces, workplaceGroups };

    app.windows.main && app.windows.main.webContents.send('workplacesUpdate', responseMessage);
    for (let workplaceData of Object.values(app.windows.workplaces)) {
        workplaceData.translate && workplaceData.translate.send('workplacesUpdate', responseMessage);
    }
}