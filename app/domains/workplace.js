import { WorkplaceWindow } from './workplace-window';

export class Workplace {
    constructor({ 
        id,
        groupId,
        title,
        active,
        parseByAreaClick,
        translateByTextSelect,
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
        this.parseByAreaClick = parseByAreaClick || false;
        this.translateByTextSelect = !!translateByTextSelect;
        this.hideByTitleClick = !!hideByTitleClick;
        this.lastParsedText = lastParsedText || '';
        this.imageCleaner = imageCleaner || {};

        this.areaWindow = new WorkplaceWindow(areaWindow || {});
        this.translateWindow = new WorkplaceWindow(translateWindow || {});
    }
}