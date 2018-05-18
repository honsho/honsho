const { remote, ipcRenderer } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import { logger } from './../../services/logger';
import { DraggableArea } from './../../components/draggable-area';
import { WorkplaceAreaWrapper } from './../../components/workplace-area/workplace-area-wrapper';
import { WorkplaceAreaContent } from './../../components/workplace-area/workplace-area-content';

const currentWindow = remote.getCurrentWindow();

class WorkplaceArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parseStarted: false
        }

        ipcRenderer.on('parseStarted', () => {
            this.setState({ parseStarted: true });
            setTimeout(() => this.setState({ parseStarted: false }), 300);
        });
    }

    onContentEnter = () => {
        currentWindow.setIgnoreMouseEvents(true, { forward: true });
    }

    onContentLeave = () => {
        currentWindow.setIgnoreMouseEvents(false);
    }

    onMouseDown = () => {
        currentWindow.setIgnoreMouseEvents(false);
    }

    onContentLeave = () => {
        currentWindow.setIgnoreMouseEvents(false);
    }

    render() {
        return <WorkplaceAreaWrapper active={this.state.parseStarted}>
            <DraggableArea active={this.state.parseStarted} />
            <WorkplaceAreaContent 
                onMouseEnter={this.onContentEnter}
                onMouseLeave={this.onContentLeave}
            />
        </WorkplaceAreaWrapper>;
    }
}

ipcRenderer.on('initialize', (event, { workplace }) => {
    ReactDOM.render(
        <WorkplaceArea workplace={workplace} />,
        document.getElementById('app')
    );
});

window.onerror = function(msg, url, line, col) {
    logger.error(`"${msg}" at ${url} ${line}:${col}`);
};