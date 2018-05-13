const { ipcRenderer } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import MdSettingsApplications from 'react-icons/lib/md/settings-applications';
import MdAddBox from 'react-icons/lib/md/add-box';
import { logger } from './../../services/logger';
import { createWorkplaceWindows } from './../../services/create-workplace-windows';
import { WorkplaceHelper } from './../../services/workplace-helper';
import { Button } from './../../components/button';
import { Header } from './../../components/main/header';
import { Workplaces } from './workplaces.jsx';
import { Settings } from './settings.jsx';
import { AddNewWorkplace } from '../../components/main/add-new-workplace';
import { Input } from '../../components/input';

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newWorkplaceName: '',
            workplaces: (props.workplaces || [])
        }

        this.workplacesWindows = {};
        this.state.workplaces.forEach(workplace => {
            const window = createWorkplaceWindows(workplace);
            this.workplacesWindows[window.id] = window;
        });

        ipcRenderer.on('workplacesUpdate', (event, workplaces) => this.updateWorkplaces(workplaces));
        ipcRenderer.on('removeWorkplace', (event, id) => this.removeWorkplaceWindow(id));
        ipcRenderer.on('leoLoginCompleted', (event, result) => {
            if (!result) {
                alert('Невозможно залогиниться в LinguaLeo', 'Ошибка');
            }
        });
    }

    changeNewWorkplaceName = e => this.setState({ newWorkplaceName: e.target.value });

    createWorkplace = e => {
        e.preventDefault();

        const name = this.state.newWorkplaceName.trim();
        if (name) {
            ipcRenderer.send('createWorkplace', { name });
        }

        this.setState({ newWorkplaceName: '' });
    }

    updateWorkplaces = workplaces => {
        workplaces.forEach(workplace => {
            let workplaceWindow = this.workplacesWindows[workplace.id];
            if (!workplaceWindow) {
                workplaceWindow = createWorkplaceWindows(workplace);
                this.workplacesWindows[workplace.id] = workplaceWindow;
            }

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
                <AddNewWorkplace>
                    <form onSubmit={this.createWorkplace}>
                        <Input
                            type="text"
                            placeholder="Название"
                            value={this.state.newWorkplaceName} onChange={this.changeNewWorkplaceName} 
                        />
                        <Button
                            withIcon
                            disabled={!this.state.newWorkplaceName.trim()}
                            type="submit"
                            title="Добавить новую рабочую область">
                            <MdAddBox size={27} />
                        </Button>
                    </form>
                </AddNewWorkplace>

                <Button withIcon onClick={this.showSettings}>
                    <MdSettingsApplications size={27} />
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