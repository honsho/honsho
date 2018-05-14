const { remote } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import { logger } from './../../services/logger';
import { DraggableArea } from './../../components/draggable-area';
import { WorkplaceAreaWrapper } from './../../components/workplace-area/workplace-area-wrapper';
import { WorkplaceAreaContent } from './../../components/workplace-area/workplace-area-content';

const currentWindow = remote.getCurrentWindow();

class WorkplaceArea extends React.Component {
    onContentEnter = () => {
        currentWindow.setIgnoreMouseEvents(true, { forward: true });
    }

    onContentLeave = () => {
        currentWindow.setIgnoreMouseEvents(false);
    }

    render() {
        return <WorkplaceAreaWrapper>
            <DraggableArea />
            <WorkplaceAreaContent onMouseEnter={this.onContentEnter} onMouseLeave={this.onContentLeave} />
        </WorkplaceAreaWrapper>;
    }
}

ReactDOM.render(
    <WorkplaceArea />,
    document.getElementById('app')
);

window.onerror = function(msg, url, line, col) {
    logger.error(`"${msg}" at ${url} ${line}:${col}`);
};