const { ipcRenderer } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import MdSettingsApplications from 'react-icons/lib/md/settings-applications';
import MdAddBox from 'react-icons/lib/md/add-box';
import { logger } from './../../services/logger';
import { Button } from './../../components/button';
import { Header } from './../../components/main/header';
import { WorkplacesList } from './../../components/main/workplaces-list.jsx';
import { Settings } from './../../components/main/settings.jsx';
import { WorkplacesGroupCreateModal } from '../../components/main/workplaces-group-create-modal.jsx';

class Main extends React.Component {
    constructor(props) {
        super(props);

        const initData = ipcRenderer.sendSync('mainWindowInit');

        this.state = {
            workplaces: initData.workplaces,
            workplaceGroups: initData.workplaceGroups,
            settingsVisible: false,
            createGroupModalVisible: false
        }

        ipcRenderer.on('workplacesUpdate', (event, { workplaces, workplaceGroups }) => this.setState({ workplaces, workplaceGroups }));
        ipcRenderer.on('leoLoginCompleted', (event, result) => {
            if (!result) {
                alert('Невозможно залогиниться в LinguaLeo', 'Ошибка');
            }
        });
    }

    showCreateGroupModal = () => this.setState({ createGroupModalVisible: true });
    hideCreateGroupModal = () => this.setState({ createGroupModalVisible: false });

    showSettings = () => this.setState({ settingsVisible: true });
    hideSettings = () => this.setState({ settingsVisible: false });

    render() {
        return <div>
            <WorkplacesGroupCreateModal
                visible={this.state.createGroupModalVisible}
                onClose={this.hideCreateGroupModal}
            />

            <Settings 
                visible={this.state.settingsVisible}
                onClose={this.hideSettings}
            />

            <Header>
                <Button withIcon title="Добавить новую группу" onClick={this.showCreateGroupModal}>
                    <MdAddBox size={27} />
                </Button>

                <Button withIcon title="Настройки приложения" onClick={this.showSettings}>
                    <MdSettingsApplications size={27} />
                </Button>
            </Header>

            <WorkplacesList workplaces={this.state.workplaces} workplaceGroups={this.state.workplaceGroups} />
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