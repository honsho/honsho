export class WorkplaceHelper {
    static showWindows(workplaceWindow) {
        try {
            if (!workplaceWindow.area.isVisible()) {
                workplaceWindow.area.show();
            }
        } catch (e) {}
        try {
            if (!workplaceWindow.text.isVisible()) {
                workplaceWindow.text.show();
            }
        } catch (e) {}
    }

    static hideWindows(workplaceWindow) {
        try {
            if (workplaceWindow.area.isVisible()) {
                workplaceWindow.area.hide();
            }
        } catch (e) {}
        try {
            if (workplaceWindow.text.isVisible()) {
                workplaceWindow.text.hide();
            }
        } catch (e) {}
    }

    static closeWindows(workplaceWindow) {
        try {
            workplaceWindow.area.close();
        } catch (e) {}
        try {
            workplaceWindow.text.close();
        } catch (e) {}
    }

    static findById(workplaces, id) {
        return workplaces.find(workplace => workplace.id == id);
    }
}