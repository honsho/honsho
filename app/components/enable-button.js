import styled from 'styled-components';

export const EnableButton = styled.button.attrs({
    title: props => props.active ? 'Выключить' : 'Включить'
})`
    position: relative;
    width: 30px;
    height: 30px;
    background: transparent;
    cursor: pointer;
    -webkit-user-select: none;
    outline: none;
    border: none;

    &:before {
        content: '';
        display: block;
        position: absolute;
        background: ${props => props.active ? '#c1cc9c' : '#e2e6e7'};
        width: 10px;
        height: 10px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;