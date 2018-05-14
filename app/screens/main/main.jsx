const { ipcRenderer } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import MdSettingsApplications from 'react-icons/lib/md/settings-applications';
import MdAddBox from 'react-icons/lib/md/add-box';
import { logger } from './../../services/logger';
import { Button } from './../../components/button';
import { Header } from './../../components/main/header';
import { Workplaces } from './workplaces.jsx';
import { Settings } from './settings.jsx';
import { AddNewWorkplace } from '../../components/main/add-new-workplace';
import { Input } from '../../components/input';

class Main extends React.Component {
    constructor(props) {
        super(props);

        const initData = ipcRenderer.sendSync('mainWindowInit');

        this.state = {
            newWorkplaceName: '',
            workplaces: initData.workplaces
        }

        ipcRenderer.on('workplacesUpdate', (event, workplaces) => this.setState({ workplaces: [...workplaces] }));
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

ReactDOM.render(
    <Main />,
    document.getElementById('app')
);

window.onerror = function(msg, url, line, col) {
    logger.error(`"${msg}" at ${url} ${line}:${col}`);
};