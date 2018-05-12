import styled from 'styled-components';

export const DeleteButton = styled.button.attrs({
    title: 'Удалить'
})`
    position: relative;
    width: 30px;
    height: 30px;
    background: transparent;
    cursor: pointer;
    -webkit-user-select: none;
    outline: none;
    border: none;

    &:before, &:after {
        content: '';
        display: block;
        position: absolute;
        background: #244769;
    }

    &:before {
        height: 1px;
        width: 15px;
        transform: rotate(-135deg);
        top: 14px;
        left: 7px;
    }

    &:after {
        height: 15px;
        width: 1px;
        transform: rotate(45deg);
        left: 14px;
        top: 7px;
    }
`;