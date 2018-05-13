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
import { OcrSettingsPanel } from './../../components/ocr-settings-panel/ocr-settings-panel.jsx';
import { DEFAULT_WORKPLACE_TEXT_COLOR } from './../../constants';

export class WorkplaceSettings extends React.Component {
    constructor(props) {
        super(props);

        const imageCleanerOptions = props.imageCleaner || {};

        this.state = {
            visible: false,
            textColor: (imageCleanerOptions.textColor || DEFAULT_WORKPLACE_TEXT_COLOR),
            basicErrorDelta: (imageCleanerOptions.basicErrorDelta || 0),
            diffErrorDelta: (imageCleanerOptions.diffErrorDelta || 0)
        }
    }

    save = () => {
        const data = {
            imageCleaner: {
                textColor: this.state.textColor,
                basicErrorDelta: this.state.basicErrorDelta,
                diffErrorDelta: this.state.diffErrorDelta
            }
        };

        ipcRenderer.send('saveWorkplaceSettings', data);
        this.close();
    }

    open = () => this.setState({ visible: true });
    close = () => this.setState({ visible: false });

    render() {
        return <div>
            <Button withIcon onClick={this.open}>
                <MdSettings size={20} />
            </Button>
            
            <Rodal height={80} width={90} measure={'%'} visible={this.state.visible} closeOnEsc={true} onClose={this.close}>
                <Modal>
                    <ModalHeader>Настройки рабочей области</ModalHeader>

                    <ModalBody>
                        <OcrSettingsPanel />
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