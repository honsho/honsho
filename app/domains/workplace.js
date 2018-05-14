import { WorkplaceWindow } from './workplace-window';

export class Workplace {
    constructor({ id, name, active, lastParsedText, imageCleaner, areaWindow, translateWindow }) {
        this.id = id;
        this.name = name || '';
        this.active = active || false;
        this.lastParsedText = lastParsedText || '';
        this.imageCleaner = imageCleaner || {};

        this.areaWindow = new WorkplaceWindow(areaWindow || {});
        this.translateWindow = new WorkplaceWindow(translateWindow || {});
    }
}