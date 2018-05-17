const { ipcRenderer } = require('electron');
import React from 'react';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdAddBox from 'react-icons/lib/md/add-box';
import { Button } from './../button';
import { WorkplaceGroup } from './workplace-group';
import { WorkplaceGroupButtons } from './workplace-group-buttons';
import { WorkplaceCreateModal } from './workplace-create-modal.jsx';
import { WorkplaceGroupSettings } from './workplace-group-settings.jsx';

export class WorkplacesGroupHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            createModalVisible: false
        };
    }

    showCreateModal = e => {
        e && e.stopPropagation();
        this.setState({ createModalVisible: true });
    }

    hideCreateModal = e => {
        e && e.stopPropagation();
        this.setState({ createModalVisible: false });
    }

    removeWorkplaceGroup = () => ipcRenderer.send('removeWorkplaceGroup', this.props.id);

    render() {
        return <WorkplaceGroup>
            <WorkplaceCreateModal
                groupId={this.props.id}
                visible={this.state.createModalVisible}
                onClose={this.hideCreateModal}
            />

            {this.props.title}

            <WorkplaceGroupButtons>
                <Button withIcon title="Добавить новую рабочую область" onClick={this.showCreateModal}>
                    <MdAddBox size={20} />
                </Button>

                <WorkplaceGroupSettings
                    id={this.props.id}
                    title={this.props.title}
                />

                <Button withIcon title="Удалить" onClick={this.removeWorkplaceGroup}>
                    <MdHighlightRemove size={20} />
                </Button>
            </WorkplaceGroupButtons>
        </WorkplaceGroup>
    }
}