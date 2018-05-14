const { ipcRenderer } = require('electron');
import React from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
const shallowEqualObjects = require('shallow-equal/objects');
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
import { Input } from '../../components/input';

export class WorkplaceSettings extends React.Component {
    constructor(props) {
        super(props);

        const imageCleanerOptions = props.imageCleaner || {};

        this.state = {
            visible: false,
            name: (props.name || ''),
            translateByClicK: !!props.translateByClicK,
            hideByTitleClick: !!props.hideByTitleClick,
            textColor: imageCleanerOptions.textColor,
            basicErrorDelta: imageCleanerOptions.basicErrorDelta,
            diffErrorDelta: imageCleanerOptions.diffErrorDelta
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!shallowEqualObjects(this.props.textColor || {}, nextProps.textColor || {})) {
            this.setState({ textColor: nextProps.textColor });
        }

        const propsToCheck = ['basicErrorDelta', 'diffErrorDelta'];
        propsToCheck.forEach(propName => {
            if (this.props[propName] != nextProps[propName]) {
                this.setState({ [propName]: nextProps[propName] });
            }
        });
    }

    onNameChange = e => this.setState({ name: e.target.value });

    toggleTranslateByClicK = () => this.setState({ translateByClicK: !this.state.translateByClicK });

    toggleHideByTitleClick = () => this.setState({ hideByTitleClick: !this.state.hideByTitleClick });

    onOcrSettingChange = (propName, value) => this.setState({ [propName]: value });

    save = () => {
        const data = {
            id: this.props.id,
            name: this.state.name,
            translateByClicK: this.state.translateByClicK,
            hideByTitleClick: this.state.hideByTitleClick,
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
                        <Panel>
                            <PanelTitle>Основное</PanelTitle>
                            <PanelBody>
                                <FormGroup>
                                    <FormLabel>Название</FormLabel>
                                    <Input type="text" value={this.state.name} onChange={this.onNameChange} />
                                </FormGroup>

                                <FormGroup>
                                    <FormLabel>Переводить по клику</FormLabel>
                                    <input type="checkbox" checked={this.state.translateByClicK} onChange={this.toggleTranslateByClicK} />
                                </FormGroup>

                                <FormGroup>
                                    <FormLabel>Скрывать окно с переводом при клике по названию окна "Перевод".</FormLabel>
                                    <input type="checkbox" checked={this.state.hideByTitleClick} onChange={this.toggleHideByTitleClick} />
                                </FormGroup>
                            </PanelBody>
                        </Panel>

                        <OcrSettingsPanel
                            textColor={this.state.textColor}
                            basicErrorDelta={this.state.basicErrorDelta}
                            diffErrorDelta={this.state.diffErrorDelta}
                            onChange={this.onOcrSettingChange} />
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