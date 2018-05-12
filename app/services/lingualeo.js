import { LeoTranslatedItem } from '../domains/leo-translated-item';
const request = require('request-promise-native').defaults({ jar: true });

export class Lingualeo {
    static async login(login, password) {
        try {
            const response = await request({
                url: 'https://api.lingualeo.com/api/login',
                method: 'POST',
                body: { email: login, password },
                json: true
            });

            if (response.error_msg) {
                throw new Error();
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    static async translate(text) {
        try {
            const response = await request({
                url: 'https://api.lingualeo.com/gettranslates',
                method: 'GET',
                qs: { word: text.trim() },
                json: true
            });

            if (response.error_msg) {
                throw new Error();
            }

            const items = response.translate.map(item => new LeoTranslatedItem(item));
            items.sort((i1, i2) => i2.votes - i1.votes);

            return items;
        } catch (e) {
            return null;
        }
    }

    static async addToDictionary(text, textTranslate = '') {
        const body = { word: text.trim() };
        if (textTranslate) {
            body.tword = textTranslate.trim();
        }

        try {
            const response = await request({
                url: 'http://api.lingualeo.com/addword',
                method: 'POST',
                body,
                json: true
            });

            if (response.error_msg) {
                throw new Error();
            }

            return true;
        } catch (e) {
            return false;
        }
    }
}