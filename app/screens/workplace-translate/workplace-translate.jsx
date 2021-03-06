const { remote, ipcRenderer } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import MdTranslate from 'react-icons/lib/md/translate';
import { logger } from './../../services/logger';
import { DraggableArea } from './../../components/draggable-area';
import { textSelection } from './../../services/text-selection';
import { TranslatePanelWrapper } from './../../components/translate-panel/translate-panel-wrapper';
import { TranslatePanel } from './../../components/translate-panel/translate-panel';
import { TranslatePanelSource } from './../../components/translate-panel/translate-panel-source';
import { TranslatePanelTarget } from './../../components/translate-panel/translate-panel-target';
import { TranslatePanelActiveContent } from './../../components/translate-panel/translate-panel-active-content';
import { TranslatePanelTranslateButton } from './../../components/translate-panel/translate-panel-translate-button';
import { LeoTranslated } from './../../components/leo-translated/leo-translated';
import { LeoTranslatedItem } from './../../components/leo-translated/leo-translated-item';
import { LeoTranslatedItemText } from './../../components/leo-translated/leo-translated-item-text';
import { LeoTranslatedItemVoices } from './../../components/leo-translated/leo-translated-item-voices';
import { Modal } from '../../components/modal/modal';
import { ModalHeader } from '../../components/modal/modal-header';
import { ModalBody } from '../../components/modal/modal-body';

class WorkplaceTranslate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            targetText: '',
            textToTranslate: '',
            workplace: props.workplace,
            translateModalVisible: false,
            translatedItems: []
        }

        this.textRef = React.createRef();

        ipcRenderer.on('workplacesUpdate', (event, { workplaces }) => {
            const workplace = workplaces[this.state.workplace.id];
            if (workplace) {
                this.setState({ workplace: { ...workplace } });
            }
        });
        ipcRenderer.on('leoTranslateCompleted', (event, translatedItems) => this.setState({ translatedItems: (translatedItems || []) }));
        ipcRenderer.on('leoAddToDictionaryCompleted', (event, result) => {
            if (!result) {
                alert('Не удалось добавить текст в словарь LinguaLeo', 'Ошибка');
            }
        });
    }

    componentDidMount() {
        textSelection(this.textRef.current, targetText => {
            targetText = targetText.trim();
            this.setState({ targetText }, () => {
                if (this.state.workplace && this.state.workplace.translateByTextSelect) {
                    this.openTranslateTextModal();
                }
            });
        });
    }

    onTargetTextChange = e => this.setState({ targetText: e.target.value });

    onTargetKeyDown = e => {
        if (e.which == 13 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
        }
    }

    onTargetKeyUp = e => {
        if (e.which == 13 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            this.openTranslateTextModal();
        }
    }

    openTranslateTextModal = async () => {
        const textToTranslate = this.state.targetText.trim();
        if (!textToTranslate) {
            return;
        }

        this.setState({ translateModalVisible: true, textToTranslate });
        ipcRenderer.send('leoTranslate', this.state.targetText);
    }

    closeTranslateTextModal = () => {
        this.setState({ translateModalVisible: false, textToTranslate: '', translatedItems: [] });
    }

    addToDictionary(translatedText) {
        this.setState({ targetText: '' });
        ipcRenderer.send('leoAddToDictionary', { text: this.state.textToTranslate, translatedText });
        this.closeTranslateTextModal();
    }

    render() {
        if (!this.state.workplace) {
            return null;
        }

        return <TranslatePanelWrapper>            
            <Rodal height={80} width={90} measure={'%'} visible={this.state.translateModalVisible} closeOnEsc={true} onClose={this.closeTranslateTextModal}>
                <Modal>
                    <ModalHeader onClick={this.state.workplace.hideByTitleClick && this.closeTranslateTextModal}>
                        Перевод
                    </ModalHeader>

                    <ModalBody>
                        <LeoTranslated>
                            {this.state.translatedItems.map(item => {
                                return <LeoTranslatedItem onClick={() => this.addToDictionary(item.value)}>
                                    <LeoTranslatedItemText>{item.value}</LeoTranslatedItemText>
                                    <LeoTranslatedItemVoices>{item.votes}</LeoTranslatedItemVoices>
                                </LeoTranslatedItem>
                            })}
                        </LeoTranslated>
                    </ModalBody>
                </Modal>
            </Rodal>

            <DraggableArea />
            <TranslatePanel>
                <TranslatePanelSource withBorder innerRef={this.textRef}>{this.state.workplace.lastParsedText}</TranslatePanelSource>
                <TranslatePanelActiveContent>
                    <TranslatePanelTarget 
                        title="Выделите текст выше, измените его здесь и нажмите на кнопку перевода"
                        value={this.state.targetText}
                        onChange={this.onTargetTextChange}
                        onKeyDown={this.onTargetKeyDown}
                        onKeyUp={this.onTargetKeyUp}
                    />
                    <TranslatePanelTranslateButton disabled={!this.state.targetText.trim()} withIcon onClick={this.openTranslateTextModal}>
                        <MdTranslate size={20} />
                    </TranslatePanelTranslateButton>
                </TranslatePanelActiveContent>
            </TranslatePanel>
        </TranslatePanelWrapper>
    }
}

ipcRenderer.on('initialize', (event, { workplace }) => {
    ReactDOM.render(
        <WorkplaceTranslate workplace={workplace} />,
        document.getElementById('app')
    );
});

window.onerror = function(msg, url, line, col) {
    logger.error(`"${msg}" at ${url} ${line}:${col}`);
};