const { ipcRenderer } = require('electron');
const shallowEqualObjects = require('shallow-equal/objects');
import React from 'react';
import { PhotoshopPicker } from 'react-color';
import { WorkplaceImageCleanerWrapper } from './workplace-image-cleaner-wrapper';
import { WorkplaceImageCleanerColorPicker } from './workplace-image-cleaner-color-picker';
import { WorkplaceImageCleanerCheckbox } from './workplace-image-cleaner-checkbox';
import { WorkplaceImageCleanerColorItem } from './workplace-image-cleaner-color-item';
import { WorkplaceImageCleanerErrorDelta } from './workplace-image-cleaner-error-delta';
import { DEFAULT_WORKPLACE_TEXT_COLOR } from './../../constants';

export class WorkplaceImageCleaner extends React.Component {
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
        return <WorkplaceImageCleanerWrapper>
            {this.state.pickerVisible && <WorkplaceImageCleanerColorPicker>
                <PhotoshopPicker 
                    header="Выберите цвет распознаваемого текста"
                    color={this.state.pickerColor}
                    onChangeComplete={this.setPickerColor}
                    onAccept={this.onPickerColorAccept}
                    onCancel={this.hideColorPicker}
                />
            </WorkplaceImageCleanerColorPicker>}

            <WorkplaceImageCleanerCheckbox onChange={this.onToggle} checked={this.state.enabled} />

            {this.state.enabled && <WorkplaceImageCleanerColorItem color={this.state.color} onClick={this.showColorPicker} />}
            {this.state.enabled && <WorkplaceImageCleanerErrorDelta 
                value={this.state.basicErrorDelta}
                title="Отклонение цвета текста при поиске по цвету текста"
                onChange={this.onBasicErrorDeltaChange}
            />}
            {this.state.enabled && <WorkplaceImageCleanerErrorDelta 
                value={this.state.diffErrorDelta}
                title="Отклонение цвета текста при поиске соседних пикселей в найденных буквах"
                onChange={this.onDiffErrorDeltaChange}
            />}
        </WorkplaceImageCleanerWrapper>
    }
}