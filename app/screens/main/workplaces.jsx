const { ipcRenderer } = require('electron');
const shallowEqualObjects = require('shallow-equal/objects');
import React from 'react';
import ReactDOM from 'react-dom';
import { WorkplaceHelper } from './../../services/workplace-helper';
import { List } from './../../components/list/list';
import { ListItem } from './../../components/list/list-item';
import { ListItemContent } from './../../components/list/list-item-content';
import { ListItemButtons } from './../../components/list/list-item-buttons';
import { DeleteButton } from './../../components/delete-button';
import { EnableButton } from './../../components/enable-button';
import { WorkplaceItemTitle } from './../../components/workplace-item/workplace-item-title';
import { WorkplaceImageCleaner } from './../../components/workplace-image-cleaner/workplace-image-cleaner.jsx';

export class Workplaces extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    toggleWorkplace = id => {
        const workplace = WorkplaceHelper.findById(this.props.workplaces, id);
        if (!workplace) {
            return;
        }

        ipcRenderer.send(workplace.active ? 'hideWorkplace' : 'showWorkplace', id);
    }

    removeWorkplace = id => ipcRenderer.send('removeWorkplace', id);

    onImageCleanerOptionsChange = (id, data) => {
        ipcRenderer.send('textColorChange', { id, textColor: data.color });
        ipcRenderer.send('basicErrorDeltaChange', { id, basicErrorDelta: data.basicErrorDelta });
        ipcRenderer.send('diffErrorDeltaChange', { id, diffErrorDelta: data.diffErrorDelta });
    }

    render() {
        return <div>
            <List>
                {this.props.workplaces.map(({ id, active, imageCleaner }, i) => {
                    imageCleaner = imageCleaner || {};
                    return <ListItem key={id}>
                        <ListItemContent>
                            <WorkplaceItemTitle>#{i + 1}</WorkplaceItemTitle>
                            <WorkplaceImageCleaner
                                basicErrorDelta={imageCleaner.basicErrorDelta}
                                diffErrorDelta={imageCleaner.diffErrorDelta}
                                color={imageCleaner.textColor}
                                onChange={data => this.onImageCleanerOptionsChange(id, data)}
                            />
                        </ListItemContent>

                        <ListItemButtons>
                            <EnableButton onClick={() => this.toggleWorkplace(id)} active={active} />
                            <DeleteButton onClick={() => this.removeWorkplace(id)} />
                        </ListItemButtons>
                    </ListItem>;
                })}
            </List>
        </div>
    }
}