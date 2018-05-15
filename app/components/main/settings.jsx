const { ipcRenderer } = require('electron');
import React from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { LeoLogin } from './../../components/leo-login/leo-login';
import { LeoLoginInput } from './../../components/leo-login/leo-login-input';
import { Button } from './../../components/button';
import { Modal } from '../../components/modal/modal';
import { ModalHeader } from '../../components/modal/modal-header';
import { ModalBody } from '../../components/modal/modal-body';
import { ModalFooter } from '../../components/modal/modal-footer';

export class Settings extends React.Component {
    constructor(props) {
        super(props);

        const { leo } = ipcRenderer.sendSync('getSettings');

        this.state = {
            leoLogin: (leo.login || ''),
            leoPassword: (leo.password || '')
        }
    }

    onLeoLoginChange = (e) => {
        const leoLogin = e.target.value.trim();
        this.setState({ leoLogin });
    }

    onLeoPasswordChange = (e) => {
        const leoPassword = e.target.value;
        this.setState({ leoPassword });
    }

    save = () => {
        ipcRenderer.send('leoLogin', { login: this.state.leoLogin, password: this.state.leoPassword });
        this.props.onClose && this.props.onClose();
    }

    cancel = () => {
        this.props.onClose && this.props.onClose();
    }

    render() {
        return <Rodal height={80} width={90} measure={'%'} visible={this.props.visible} closeOnEsc={true} onClose={this.props.onClose}>
            <Modal>
                <ModalHeader>Настройки</ModalHeader>

                <ModalBody>
                    <LeoLogin>
                        <LeoLoginInput
                            type="text"
                            placeholder="Лингвалео логин"
                            marginRight
                            value={this.state.leoLogin}
                            onChange={this.onLeoLoginChange}
                        />
                        <LeoLoginInput
                            type="password"
                            placeholder="Лингвалео пароль"
                            value={this.state.leoPassword}
                            onChange={this.onLeoPasswordChange}
                        />
                    </LeoLogin>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={this.save}>Сохранить</Button>
                    <Button onClick={this.cancel}>Отмена</Button>
                </ModalFooter>
            </Modal>
        </Rodal>
    }
}