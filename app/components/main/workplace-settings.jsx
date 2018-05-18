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
import { Input } from '../../components/input';

export class WorkplaceSettings extends React.Component {
    constructor(props) {
        super(props);

        const imageCleanerOptions = props.imageCleaner || {};

        this.state = {
            visible: false,
            title: (props.title || ''),
            parseByAreaClick: !!props.parseByAreaClick,
            translateByTextSelect: !!props.translateByTextSelect,
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

    onTitleChange = e => this.setState({ title: e.target.value });

    toggleTranslateByTextSelect = () => this.setState({ translateByTextSelect: !this.state.translateByTextSelect });

    toggleHideByTitleClick = () => this.setState({ hideByTitleClick: !this.state.hideByTitleClick });

    onOcrSettingChange = (propName, value) => this.setState({ [propName]: value });

    save = () => {
        const data = {
            id: this.props.id,
            title: this.state.title,
            parseByAreaClick: this.state.parseByAreaClick,
            translateByTextSelect: this.state.translateByTextSelect,
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
                    <ModalHeader>Настройки рабочей области</ModalHeader>

                    <ModalBody>
                        <Panel>
                            <PanelTitle>Основное</PanelTitle>
                            <PanelBody>
                                <FormGroup inline>
                                    <FormLabel>Название</FormLabel>
                                    <Input type="text" value={this.state.title} onChange={this.onTitleChange} />
                                </FormGroup>

                                <FormGroup inline>
                                    <FormLabel>Переводить сразу после выделения текста</FormLabel>
                                    <input type="checkbox" checked={this.state.translateByTextSelect} onChange={this.toggleTranslateByTextSelect} />
                                </FormGroup>

                                <FormGroup inline>
                                    <FormLabel>Скрывать окно с переводом при клике по названию окна "Перевод".</FormLabel>
                                    <input type="checkbox" checked={this.state.hideByTitleClick} onChange={this.toggleHideByTitleClick} />
                                </FormGroup>
                            </PanelBody>
                        </Panel>

                        <OcrSettingsPanel
                            parseByAreaClick={this.state.parseByAreaClick}
                            textColor={this.state.textColor}
                            basicErrorDelta={this.state.basicErrorDelta}
                            diffErrorDelta={this.state.diffErrorDelta}
                            onChange={this.onOcrSettingChange}
                        />
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