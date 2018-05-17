const { ipcRenderer } = require('electron');
import React from 'react';
import { List } from './../list/list';
import { WorkplacesListItem } from './workplaces-list-item.jsx';
import { Accordion } from './../accordion/accordion';
import { WorkplacesGroupHeader } from './workplaces-group-header.jsx';

export class WorkplacesList extends React.Component {
    renderWorkplace = id => {
        const workplace = (this.props.workplaces || {})[id];
        if (!workplace) {
            return null;
        }

        return <WorkplacesListItem {...workplace} key={workplace.id} />;
    }

    render() {
        const workplaceGroups = Object.values(this.props.workplaceGroups);

        return <List>
            {workplaceGroups.map(workplaceGroup => {
                const header = <WorkplacesGroupHeader {...workplaceGroup} />;
                const items = workplaceGroup.workplacesIds.map(this.renderWorkplace);

                return <Accordion key={workplaceGroup.id} header={header} items={items} />
            })}
        </List>
    }
}