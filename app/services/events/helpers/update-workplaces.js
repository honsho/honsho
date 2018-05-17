export const updateWorkplaces = (app, updateAction, onComplete) => {
    let workplaces = app.store.get('workplaces') || {};
    let workplaceGroups = app.store.get('workplaceGroups') || {};

    const data = updateAction(workplaces, workplaceGroups);
    workplaces = data.workplaces;
    workplaceGroups = data.workplaceGroups;

    app.store.set(`workplaces`, workplaces);
    app.store.set(`workplaceGroups`, workplaceGroups);
    
    onComplete && onComplete(workplaces, workplaceGroups);

    const responseMessage = { workplaces, workplaceGroups };

    app.windows.main && app.windows.main.send('workplacesUpdate', responseMessage);
    for (let workplaceData of Object.values(app.windows.workplaces)) {
        workplaceData.translate && workplaceData.translate.send('workplacesUpdate', responseMessage);
    }
}