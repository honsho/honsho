const { ipcMain } = require('electron');
import { Lingualeo } from './../lingualeo';

export default app => {
    ipcMain.on('leoLogin', async (event, { login, password }) => {
        app.store.set('leo.login', login);
        app.store.set('leo.password', password);

        const result = await Lingualeo.login(login, password);
        app.windows.main.send('leoLoginCompleted', result);
    });

    ipcMain.on('leoTranslate', async (event, text) => {
        const translatedItems = await Lingualeo.translate(text);
        event.sender && event.sender.send('leoTranslateCompleted', translatedItems);
    });

    ipcMain.on('leoAddToDictionary', async (event, { text, translatedText }) => {
        const result = await Lingualeo.addToDictionary(text, translatedText);
        event.sender && event.sender.send('leoAddToDictionaryCompleted', result);
    });
};