const { ipcRenderer } = require('electron');
const shallowEqualObjects = require('shallow-equal/objects');
import React from 'react';
import { PhotoshopPicker } from 'react-color';
import { OcrColorPicker } from './ocr-color-picker';
import { OcrColorItem } from './ocr-color-item';
import { OcrErrorDelta } from './ocr-error-delta';
import { Panel } from './../panel/panel';
import { PanelTitle } from './../panel/panel-title';
import { PanelBody } from './../panel/panel-body';
import { FormGroup } from '../form/form-group';
import { FormLabel } from '../form/form-label';
import { DEFAULT_WORKPLACE_TEXT_COLOR } from './../../constants';

export class OcrSettingsPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            enabled: !!props.textColor,
            pickerColor: (props.textColor || DEFAULT_WORKPLACE_TEXT_COLOR),
            pickerVisible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!shallowEqualObjects(this.props.textColor || {}, nextProps.textColor || {})) {
            this.setState({ enabled: !!nextProps.textColor });
        }
    }

    onChange = (propName, value) => {
        if (!this.state.enabled) {
            value = null;
        }

        this.props.onChange && this.props.onChange(propName, value);
    }

    onToggle = () => {
        this.setState({ enabled: !this.state.enabled }, () => {
            this.onChange('textColor', this.props.textColor || DEFAULT_WORKPLACE_TEXT_COLOR);
            this.onChange('basicErrorDelta', this.props.basicErrorDelta || 0);
            this.onChange('diffErrorDelta', this.props.diffErrorDelta || 0);
        });
    }

    setPickerColor = value => {
        const pickerColor = { r: value.rgb.r, g: value.rgb.g, b: value.rgb.b };
        this.setState({ pickerColor });
    }

    onPickerColorAccept = () => {
        this.onChange('textColor', this.state.pickerColor);
        this.hideColorPicker();
    }

    showColorPicker = () => {
        this.setState({ pickerVisible: true, pickerColor: this.props.textColor });
    }

    hideColorPicker = () => {
        this.setState({ pickerVisible: false });
    }

    onBasicErrorDeltaChange = e => {
        const basicErrorDelta = parseInt(e.target.value) || 0;
        this.onChange('basicErrorDelta', basicErrorDelta);
    }

    onDiffErrorDeltaChange = e => {
        const diffErrorDelta = parseInt(e.target.value) || 0;
        this.onChange('diffErrorDelta', diffErrorDelta);
    }

    render() {
        return <Panel>
            <PanelTitle>Распознавание текста</PanelTitle>
            <PanelBody>
                {this.state.pickerVisible && <OcrColorPicker>
                    <PhotoshopPicker 
                        header="Выберите цвет распознаваемого текста"
                        color={this.state.pickerColor}
                        onChangeComplete={this.setPickerColor}
                        onAccept={this.onPickerColorAccept}
                        onCancel={this.hideColorPicker}
                    />
                </OcrColorPicker>}

                <FormGroup inline>
                    <FormLabel>Включить улучшенное распознавание текста</FormLabel>
                    <input type="checkbox" onChange={this.onToggle} checked={this.state.enabled} />
                </FormGroup>

                {this.state.enabled && <FormGroup inline>
                    <FormLabel>Цвет текста</FormLabel>
                    <OcrColorItem color={this.props.textColor || DEFAULT_WORKPLACE_TEXT_COLOR} onClick={this.showColorPicker} />
                </FormGroup>}

                {this.state.enabled && <FormGroup inline>
                    <FormLabel>Отклонение цвета текста при поиске по цвету текста</FormLabel>
                    <OcrErrorDelta 
                        value={this.props.basicErrorDelta || 0}
                        onChange={this.onBasicErrorDeltaChange}
                    />
                </FormGroup>}

                {this.state.enabled && <FormGroup inline>
                    <FormLabel>Отклонение цвета текста при поиске соседних пикселей в найденном</FormLabel>
                    <OcrErrorDelta 
                        value={this.props.diffErrorDelta || 0}
                        onChange={this.onDiffErrorDeltaChange}
                    />
                </FormGroup>}
            </PanelBody>
        </Panel>;
    }
}