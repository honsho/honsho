import { WorkplaceWindow } from './workplace-window';

export class Workplace {
    constructor({ id, name, active, lastParsedText, imageCleaner, area, text }) {
        this.id = id;
        this.name = name || '';
        this.active = active || false;
        this.lastParsedText = lastParsedText || '';
        this.imageCleaner = imageCleaner || {};

        this.area = new WorkplaceWindow(area || {});
        this.text = new WorkplaceWindow(text || {});
    }
}