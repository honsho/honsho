import styled from 'styled-components';

export const WorkplaceAreaWrapper = styled.div`
    display: flex;
    flex-direction: row;
    border: 3px solid #8399c5;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out;

    &:hover {
        opacity: 1;
    }
`;