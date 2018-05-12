import styled, { css } from 'styled-components';

export const Input = styled.input`
    box-sizing: border-box;
    flex: 1 0;
    padding: 5px 10px;
    color: #244769;
    border: 1px solid #b5d1f1;
    outline: none;

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