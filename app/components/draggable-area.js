import styled from 'styled-components';

export const DraggableArea = styled.div`
    flex: 0 1;
    position: relative;
    flex-basis: 15px;
    height: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    cursor: -webkit-grab;
    -webkit-app-region: drag;
    background: ${props => props.active ? (props.activeColor || '#b5d1f1') : (props.color || '#8399c5')};
    transition: background-color 0.15s ease-in-out;

    &:before, &:after {
        content: "";
        display: block;
        position: absolute;
        width: 1px;
        height: 15px;
        top: 50%;
        margin-top: -10px;
        background: ${props => props.dragColor || '#ffffff'};
        -webkit-app-region: drag;
    }

    &:before {
        left: 3px;
    }

    &:after {
        left: 8px;
    }
`;