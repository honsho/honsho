const { ipcRenderer } = require('electron');
import React from 'react';
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdVisibility from 'react-icons/lib/md/visibility';
import MdVisibilityOff from 'react-icons/lib/md/visibility-off';
import { Button } from './../../components/button';
import { ListItem } from './../../components/list/list-item';
import { ListItemContent } from './../../components/list/list-item-content';
import { ListItemButtons } from './../../components/list/list-item-buttons';
import { WorkplaceItemTitle } from './../../components/workplace-item/workplace-item-title';
import { WorkplaceSettings } from './workplace-settings.jsx';

export class WorkplacesListItem extends React.Component {
    toggleWorkplace = () => ipcRenderer.send(this.props.active ? 'hideWorkplace' : 'showWorkplace', this.props.id);

    removeWorkplace = () => ipcRenderer.send('removeWorkplace', this.props.id);

    render() {
        let { id, title, active, parseByAreaClick, translateByTextSelect, hideByTitleClick, imageCleaner } = this.props;
        imageCleaner = imageCleaner || {};

        return <ListItem>
            <ListItemContent>
                <WorkplaceItemTitle>{title}</WorkplaceItemTitle>
            </ListItemContent>

            <ListItemButtons>
                <Button withIcon onClick={this.toggleWorkplace}>
                    {active ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                </Button>

                <WorkplaceSettings
                    id={id}
                    title={title}
                    parseByAreaClick={parseByAreaClick}
                    translateByTextSelect={translateByTextSelect}
                    hideByTitleClick={hideByTitleClick}
                    imageCleaner={imageCleaner}
                />

                <Button withIcon onClick={this.removeWorkplace}>
                    <MdHighlightRemove size={20} />
                </Button>
            </ListItemButtons>
        </ListItem>
    }
}