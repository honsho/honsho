import styled from 'styled-components';
import { FormLabel } from './form-label';

export const FormGroup = styled.div`
    display: flex;
    flex-direction: ${props => props.inline ? 'row' : 'column'};
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    margin: 10px 0;

    ${FormLabel} {
        padding-bottom: ${props => !props.inline ? '5px' : '0px'};
    }
`;