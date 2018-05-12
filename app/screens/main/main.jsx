const { ipcRenderer } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import MdSettingsApplications from 'react-icons/lib/md/settings-applications';
import { logger } from './../../services/logger';
import { createWorkplaceWindows } from './../../services/create-workplace-windows';
import { WorkplaceHelper } from './../../services/workplace-helper';
import { Button } from './../../components/button';
import { Header } from './../../components/main/header';
import { Workplaces } from './workplaces.jsx';
import { Settings } from './settings.jsx';

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.workplacesWindows = {};
        this.state = {
            leoLogin: (props.leoLogin || ''),
            workplaces: (props.workplaces || [])
        }

        this.state.workplaces.forEach(workplace => this.createWorkplaceWindows(workplace));

        ipcRenderer.on('workplacesUpdate', (event, workplaces) => this.updateWorkplaces(workplaces));
        ipcRenderer.on('removeWorkplace', (event, id) => this.removeWorkplaceWindow(id));
        ipcRenderer.on('leoLoginCompleted', (event, result) => {
            if (!result) {
                alert('Невозможно залогиниться в LinguaLeo', 'Ошибка');
            }
        });
    }

    createWorkplaceWindows = workplace => {
        const windowsData = createWorkplaceWindows(workplace, this.state.workplaces);
        this.workplacesWindows[windowsData.id] = windowsData;
    }

    updateWorkplaces = workplaces => {
        workplaces.forEach(workplace => {
            const workplaceWindow = this.workplacesWindows[workplace.id];
            workplaceWindow.text.send('textChange', workplace.lastParsedText);

            if (workplace.active) {
                WorkplaceHelper.showWindows(workplaceWindow);
            } else {
                WorkplaceHelper.hideWindows(workplaceWindow);
            }
        });

        this.setState({ workplaces: [...workplaces] });
    }

    removeWorkplaceWindow = id => {
        if (this.workplacesWindows[id]) {
            WorkplaceHelper.closeWindows(this.workplacesWindows[id]);
            delete this.workplacesWindows[id];
        }
    }

    showSettings = () => this.setState({ settingsVisible: true });
    hideSettings = () => this.setState({ settingsVisible: false });

    render() {
        return <div>
            <Settings 
                visible={this.state.settingsVisible}
                onClose={this.hideSettings}
                leoLogin={this.state.leoLogin}
            />

            <Header>
                <Button onClick={this.createWorkplaceWindows}>
                    Добавить рабочую область
                </Button>
                <Button withIcon onClick={this.showSettings}>
                    <MdSettingsApplications size={20} />
                </Button>
            </Header>

            <Workplaces workplaces={this.state.workplaces} />
        </div>
    }
}

ipcRenderer.once('initialize', (event, { workplaces, leoInfo }) => {
    ReactDOM.render(
        <Main workplaces={workplaces} leoLogin={leoInfo.login} />,
        document.getElementById('app')
    );
});

window.onerror = function(msg, url, line, col) {
    logger.error(`"${msg}" at ${url} ${line}:${col}`);
};