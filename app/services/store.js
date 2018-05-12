const { app, remote } = require('electron');
const fs = require('fs');
const path = require('path');

export class Store {
    constructor(saveable) {
        if (saveable) {
            this.savePath = path.join((app || remote.app).getPath('userData'), '/vnrleo-config.json');
            try {
                this.data = JSON.parse(fs.readFileSync(this.savePath)) || {};
            } catch (e) {}
        }
        
        this.data = this.data || {};
    }

    get(name) {
        const nameParts = name.split('.');

        let pos = this.data;
        for (let i in nameParts) {
            const part = nameParts[i];

            if (i != (nameParts.length - 1)) {
                if (!pos[part]) {
                    return null;
                }
                pos = pos[part];
            } else {
                return (typeof pos[part] === 'object' && !Array.isArray(pos[part]) && pos[part] != null) ? 
                    { ... pos[part] } :
                    pos[part];
            }
        }
    }

    set(name, value) {
        const nameParts = name.split('.');

        let pos = this.data;
        for (let i in nameParts) {
            const part = nameParts[i];

            if (i != (nameParts.length - 1)) {
                if (!pos[part]) {
                    pos[part] = {};
                }
                pos = pos[part];
            } else {
                pos[part] = value;
            }
        }

        this.save();
    }

    remove(name) {
        const nameParts = name.split('.');

        let pos = this.data;
        for (let i in nameParts) {
            const part = nameParts[i];

            if (i != (nameParts.length - 1)) {
                if (!pos[part]) {
                    return null;
                }
                pos = pos[part];
            } else {
                delete pos[part];
            }
        }

        this.save();
    }

    save() {
        if (!this.savePath) {
            return;
        }
        
        const data = fs.writeFileSync(this.savePath, JSON.stringify(this.data, null, 4));
    }
}