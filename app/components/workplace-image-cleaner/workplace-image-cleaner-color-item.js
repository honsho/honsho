import styled from 'styled-components';
import { DEFAULT_WORKPLACE_TEXT_COLOR } from './../../constants';

export const WorkplaceImageCleanerColorItem = styled.div.attrs({
    title: 'Цвет текста'
})`
    width: 15px;
    height: 15px;
    border: 1px solid #b5d1f1;
    background: ${props => {
        const color = props.color || DEFAULT_WORKPLACE_TEXT_COLOR;
        return `rgb(${color.r}, ${color.g}, ${color.b})`
    }};
    cursor: pointer;
    margin-left: 5px;
`;