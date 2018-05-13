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

        const startColor = (props.color || DEFAULT_WORKPLACE_TEXT_COLOR);

        this.state = {
            enabled: !!props.color,
            color: startColor,
            pickerColor: startColor,
            pickerVisible: false,
            basicErrorDelta: (props.basicErrorDelta || 0),
            diffErrorDelta: (props.diffErrorDelta || 0)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!shallowEqualObjects(this.props.color || {}, nextProps.color || {})) {
            this.setState({ color: nextProps.color });
        }
        if (this.props.basicErrorDelta != nextProps.basicErrorDelta) {
            this.setState({ basicErrorDelta: nextProps.basicErrorDelta });
        }
        if (this.props.diffErrorDelta != nextProps.diffErrorDelta) {
            this.setState({ diffErrorDelta: nextProps.diffErrorDelta });
        }
    }

    onChange = (data = {}, enabled = this.state.enabled) => {
        data = {
            color: this.state.color,
            basicErrorDelta: this.state.basicErrorDelta,
            diffErrorDelta: this.state.diffErrorDelta,
            ...data
        };

        data.color = enabled ? data.color: null;
        data.basicErrorDelta = enabled ? data.basicErrorDelta: null;
        data.diffErrorDelta = enabled ? data.diffErrorDelta: null;

        this.props.onChange && this.props.onChange(data);
    }

    onToggle = () => {
        this.onChange({}, !this.state.enabled);
        this.setState({ enabled: !this.state.enabled });
    }

    setPickerColor = value => {
        const pickerColor = { r: value.rgb.r, g: value.rgb.g, b: value.rgb.b };
        this.setState({ pickerColor });
    }

    onPickerColorAccept = () => {
        this.onChange({ color: this.state.pickerColor });
        this.setState({ color: this.state.pickerColor });
        this.hideColorPicker();
    }

    showColorPicker = () => {
        this.setState({ pickerVisible: true, pickerColor: this.state.color });
    }

    hideColorPicker = () => {
        this.setState({ pickerVisible: false });
    }

    onBasicErrorDeltaChange = e => {
        const basicErrorDelta = parseInt(e.target.value) || 0;
        this.onChange({ basicErrorDelta });
        this.setState({ basicErrorDelta });
    }

    onDiffErrorDeltaChange = e => {
        const diffErrorDelta = parseInt(e.target.value) || 0;
        this.onChange({ diffErrorDelta });
        this.setState({ diffErrorDelta });
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

                <FormGroup>
                    <FormLabel>Включить улучшенное распознавание текста</FormLabel>
                    <input type="checkbox" onChange={this.onToggle} checked={this.state.enabled} />
                </FormGroup>

                {this.state.enabled && <FormGroup>
                    <FormLabel>Цвет текста</FormLabel>
                    <OcrColorItem color={this.state.color} onClick={this.showColorPicker} />
                </FormGroup>}

                {this.state.enabled && <FormGroup>
                    <FormLabel>Отклонение цвета текста при поиске по цвету текста</FormLabel>
                    <OcrErrorDelta 
                        value={this.state.basicErrorDelta}
                        onChange={this.onBasicErrorDeltaChange}
                    />
                </FormGroup>}

                {this.state.enabled && <FormGroup>
                    <FormLabel>Отклонение цвета текста при поиске соседних пикселей в найденном</FormLabel>
                    <OcrErrorDelta 
                        value={this.state.diffErrorDelta}
                        onChange={this.onDiffErrorDeltaChange}
                    />
                </FormGroup>}
            </PanelBody>
        </Panel>;
    }
}