const { ipcRenderer } = require('electron');
import React from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import MdSettings from 'react-icons/lib/md/settings';
import { Button } from './../../components/button';
import { Modal } from '../../components/modal/modal';
import { ModalHeader } from '../../components/modal/modal-header';
import { ModalBody } from '../../components/modal/modal-body';
import { ModalFooter } from '../../components/modal/modal-footer';
import { Panel } from '../../components/panel/panel';
import { PanelTitle } from '../../components/panel/panel-title';
import { PanelBody } from '../../components/panel/panel-body';
import { FormGroup } from '../../components/form/form-group';
import { FormLabel } from '../../components/form/form-label';
import { Input } from '../../components/input';

export class WorkplaceGroupSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            title: (props.title || '')
        }
    }

    onTitleChange = e => this.setState({ title: e.target.value });

    save = () => {
        const data = {
            id: this.props.id,
            title: this.state.title
        };

        ipcRenderer.send('saveWorkplaceGroupSettings', data);
        this.close();
    }

    open = e => {
        e && e.stopPropagation();
        this.setState({ visible: true });
    }
    
    close = e => {
        e && e.stopPropagation();
        this.setState({ visible: false });
    }

    render() {
        return <div>
            <Button withIcon onClick={this.open}>
                <MdSettings size={20} />
            </Button>
            
            <Rodal height={80} width={90} measure={'%'} visible={this.state.visible} closeOnEsc={true} onClose={this.close}>
                <Modal>
                    <ModalHeader>Настройки группы</ModalHeader>

                    <ModalBody>
                        <Panel>
                            <PanelTitle>Основное</PanelTitle>
                            <PanelBody>
                                <FormGroup inline>
                                    <FormLabel>Название</FormLabel>
                                    <Input type="text" value={this.state.title} onChange={this.onTitleChange} />
                                </FormGroup>
                            </PanelBody>
                        </Panel>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={this.save}>Сохранить</Button>
                        <Button onClick={this.close}>Отмена</Button>
                    </ModalFooter>
                </Modal>
            </Rodal>
        </div>
    }
}