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

export class WorkplacesGroupCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this.titleRef = React.createRef();

        this.state = {
            title: (props.title || '')
        }
    }

    focusTextInput = () => {
        setTimeout(() => {
            this.titleRef.current && this.titleRef.current.focus();
        }, 0);
    }

    onTitleChange = (e) => {
        const title = e.target.value;
        this.setState({ title });
    }

    create = () => {
        if (!this.state.title) {
            return;
        }

        ipcRenderer.send('createWorkplaceGroup', { title: this.state.title });
        this.setState({ title: '' });
        this.close();
    }

    close = () => {
        this.props.onClose && this.props.onClose();
    }

    render() {
        return <Rodal height={150} visible={this.props.visible} closeOnEsc={true} onClose={this.props.onClose} onAnimationEnd={this.focusTextInput}>
            <Modal>
                <ModalHeader>Создание новой группы</ModalHeader>

                <ModalBody>
                    <form onSubmit={this.create}>
                        <FormGroup>
                            <FormLabel>Название</FormLabel>
                            <Input innerRef={this.titleRef} type="text" value={this.state.title} onChange={this.onTitleChange} />
                        </FormGroup>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button disabled={!this.state.title} onClick={this.create}>Создать</Button>
                    <Button onClick={this.close}>Отмена</Button>
                </ModalFooter>
            </Modal>
        </Rodal>
    }
}