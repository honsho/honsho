const { ipcRenderer } = require('electron');
import React from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { Button } from './../../components/button';
import { Modal } from '../../components/modal/modal';
import { ModalHeader } from '../../components/modal/modal-header';
import { ModalBody } from '../../components/modal/modal-body';
import { ModalFooter } from '../../components/modal/modal-footer';
import { Input } from '../input';
import { FormGroup } from '../form/form-group';
import { FormLabel } from '../form/form-label';

export class WorkplaceCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: (props.title || '')
        }
    }

    onTitleChange = (e) => {
        const title = e.target.value;
        this.setState({ title });
    }

    create = () => {
        if (!this.state.title) {
            return;
        }

        ipcRenderer.send('createWorkplace', { title: this.state.title, groupId: this.props.groupId });
        this.setState({ title: '' })
        this.close();
    }

    close = () => {
        this.props.onClose && this.props.onClose();
    }

    render() {
        return <Rodal height={80} width={90} measure={'%'} visible={this.props.visible} closeOnEsc={true} onClose={this.props.onClose}>
            <Modal>
                <ModalHeader>Создание новой группы</ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <FormLabel>Название</FormLabel>
                        <Input type="text" value={this.state.title} onChange={this.onTitleChange} />
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button disabled={!this.state.title} onClick={this.create}>Создать</Button>
                    <Button onClick={this.close}>Отмена</Button>
                </ModalFooter>
            </Modal>
        </Rodal>
    }
}