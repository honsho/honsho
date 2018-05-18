import styled from 'styled-components';

export const WorkplaceAreaWrapper = styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    border: 3px solid ${props => props.active ? '#b5d1f1' : '#8399c5'};
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    transition: border-color 0.15s ease-in-out;
`;