const { ipcRenderer } = require('electron');
const shallowEqualObjects = require('shallow-equal/objects');
import React from 'react';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdVisibility from 'react-icons/lib/md/visibility';
import MdVisibilityOff from 'react-icons/lib/md/visibility-off';
import { WorkplaceHelper } from './../../services/workplace-helper';
import { Button } from './../../components/button';
import { List } from './../../components/list/list';
import { ListItem } from './../../components/list/list-item';
import { ListItemContent } from './../../components/list/list-item-content';
import { ListItemButtons } from './../../components/list/list-item-buttons';
import { WorkplaceItemTitle } from './../../components/workplace-item/workplace-item-title';
import { WorkplaceSettings } from './workplace-settings.jsx';

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
                {this.props.workplaces.map(({ id, name, active, imageCleaner }, i) => {
                    imageCleaner = imageCleaner || {};
                    return <ListItem key={id}>
                        <ListItemContent>
                            <WorkplaceItemTitle>{name}</WorkplaceItemTitle>
                        </ListItemContent>

                        <ListItemButtons>
                            <Button withIcon onClick={() => this.toggleWorkplace(id)}>
                                {active ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                            </Button>

                            <WorkplaceSettings />

                            <Button withIcon onClick={() => this.removeWorkplace(id)}>
                                <MdHighlightRemove size={20} />
                            </Button>
                        </ListItemButtons>
                    </ListItem>;
                })}
            </List>
        </div>
    }
}