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

class WorkplaceText extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sourceText: '',
            targetText: '',
            textToTranslate: '',
            translateModalVisible: false,
            translatedItems: []
        }

        this.textRef = React.createRef();

        ipcRenderer.on('textChange', (event, newText) => {
            if (newText === this.state.text) {
                return;
            }

            this.setState({ sourceText: newText });
        });
        ipcRenderer.on('leoTranslateCompleted', (event, translatedItems) => this.setState({ translatedItems: (translatedItems || []) }));
        ipcRenderer.on('leoAddToDictionaryCompleted', (event, result) => {
            if (!result) {
                alert('Не удалось добавить текст в словарь LinguaLeo', 'Ошибка');
            }
        });
    }

    componentDidMount() {
        textSelection(this.textRef.current, targetText => this.setState({ targetText: targetText.trim() }));
    }

    onTargetTextChange = e => {
        this.setState({ targetText: e.target.value });
    }

    openTranslateTextModal = async () => {
        this.setState({ translateModalVisible: true, textToTranslate: this.state.targetText });
        ipcRenderer.send('leoTranslate', this.state.targetText);
    }

    closeTranslateTextModal = () => {
        this.setState({ translateModalVisible: false, textToTranslate: '', translatedItems: [] });
    }

    addToDictionary(translatedText) {
        ipcRenderer.send('leoAddToDictionary', { text: this.state.textToTranslate, translatedText });
        this.closeTranslateTextModal();
    }

    render() {
        return <TranslatePanelWrapper>            
            <Rodal height={80} width={90} measure={'%'} visible={this.state.translateModalVisible} closeOnEsc={true} onClose={this.closeTranslateTextModal}>
                <LeoTranslated>
                    {this.state.translatedItems.map(item => {
                        return <LeoTranslatedItem onClick={() => this.addToDictionary(item.value)}>
                            <LeoTranslatedItemText>{item.value}</LeoTranslatedItemText>
                            <LeoTranslatedItemVoices>{item.votes}</LeoTranslatedItemVoices>
                        </LeoTranslatedItem>
                    })}
                </LeoTranslated>
            </Rodal>

            <DraggableArea />
            <TranslatePanel>
                <TranslatePanelSource withBorder innerRef={this.textRef}>{this.state.sourceText}</TranslatePanelSource>
                <TranslatePanelActiveContent>
                    <TranslatePanelTarget title="Выделите текст выше, измените его здесь и нажмите на кнопку перевода" value={this.state.targetText} onChange={this.onTargetTextChange} />
                    <TranslatePanelTranslateButton withIcon onClick={this.openTranslateTextModal}>
                        <MdTranslate size={20} />
                    </TranslatePanelTranslateButton>
                </TranslatePanelActiveContent>
            </TranslatePanel>
        </TranslatePanelWrapper>
    }
}

ipcRenderer.once('initialize', (event, { id }) => {
    ReactDOM.render(
        <WorkplaceText id={id} />,
        document.getElementById('app')
    );
});

window.onerror = function(msg, url, line, col) {
    logger.error(`"${msg}" at ${url} ${line}:${col}`);
};