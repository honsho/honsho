const { ipcRenderer } = require('electron');
import React from 'react';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdAddBox from 'react-icons/lib/md/add-box';
import { Button } from './../../components/button';
import { WorkplaceGroup } from '../../domains/workplace-group';
import { WorkplaceGroupButtons } from './workplace-group-buttons';
import { WorkplaceCreateModal } from './workplace-create-modal.jsx';

export class WorkplacesGroupHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            createModalVisible: false
        };
    }

    showCreateModal = () => this.setState({ createModalVisible: true });
    hideCreateModal = () => this.setState({ createModalVisible: false });

    removeWorkplaceGroup = () => ipcRenderer.send('removeWorkplaceGroup', this.props.id);

    render() {
        let { id, name, active, translateByClicK, hideByTitleClick, imageCleaner } = this.props;
        imageCleaner = imageCleaner || {};

        return <WorkplaceGroup>
            <WorkplaceCreateModal
                visible={this.state.createModalVisible}
                onClose={this.hideCreateModal}
            />

            {workplaceGroup.title}
            <WorkplaceGroupButtons>
                <Button withIcon title="Добавить новую рабочую область" onClick={this.showCreateModal}>
                    <MdAddBox size={20} />
                </Button>

                <Button withIcon title="Удалить" onClick={this.removeWorkplaceGroup}>
                    <MdHighlightRemove size={20} />
                </Button>
            </WorkplaceGroupButtons>
        </WorkplaceGroup>
    }
}