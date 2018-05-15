import { WorkplaceWindow } from './workplace-window';

export class Workplace {
    constructor({ 
        id,
        groupId,
        title, 
        active, 
        translateByClicK, 
        hideByTitleClick, 
        lastParsedText, 
        imageCleaner,
        areaWindow,
        translateWindow
    }) {
        this.id = id;
        this.groupId = groupId;
        this.title = title || '';
        this.active = active || false;
        this.translateByClicK = !!translateByClicK;
        this.hideByTitleClick = !!hideByTitleClick;
        this.lastParsedText = lastParsedText || '';
        this.imageCleaner = imageCleaner || {};

        this.areaWindow = new WorkplaceWindow(areaWindow || {});
        this.translateWindow = new WorkplaceWindow(translateWindow || {});
    }
}