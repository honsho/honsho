export const createMenu = () => {
    const template = [{
        label: 'Данные',
        submenu: [{
            label: 'Импорт'
        }, {
            label: 'Экспорт'
        }]
    }, {
        label: 'Справка',
        submenu: [{
            label: 'О программе',
        }, {
            label: 'Проверить обновления',
        }, {
            label: 'Руководство к использованию'
        }]
    }];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}