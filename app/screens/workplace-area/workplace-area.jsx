const { remote } = require('electron');
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { logger } from './../../services/logger';
import { Wrapper } from './../../components/workplace-area/wrapper';
import { DraggableArea } from './../../components/draggable-area';
import { Content } from './../../components/workplace-area/content';

const currentWindow = remote.getCurrentWindow();

class WorkplaceArea extends React.Component {
    onContentEnter = () => {
        currentWindow.setIgnoreMouseEvents(true, { forward: true });
    }

    onContentLeave = () => {
        currentWindow.setIgnoreMouseEvents(false);
    }

    render() {
        return <Wrapper>
            <DraggableArea />
            <Content onMouseEnter={this.onContentEnter} onMouseLeave={this.onContentLeave} />
        </Wrapper>;
    }
}

ReactDOM.render(
    <WorkplaceArea />,
    document.getElementById('app')
);

window.onerror = function(msg, url, line, col) {
    logger.error(`"${msg}" at ${url} ${line}:${col}`);
};