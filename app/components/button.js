import styled, { css } from 'styled-components';

export const Button = styled.button`
    box-sizing: border-box;
    border-radius: 3px;
    padding: ${props => props.withIcon ? '0px' : '5px 10px'};
    border: ${props => props.withIcon ? 'none' : '1px solid #b5d1f1'};
    background: transparent;
    color: #244769;
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    margin: 0 2px;

    &[disabled] {
        cursor: not-allowed;
        opacity: 0.5;
    }

    ${props => props.success && css`
        border-color: #072a16;
        color: #2d6b22;
    `}

    ${props => props.error && css`
        border-color: #a80500;
        color: #e56a6b;
    `}
`;