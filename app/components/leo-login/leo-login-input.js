import styled from 'styled-components';
import { Input } from './../input';

export const LeoLoginInput = Input.extend`
    margin-right: ${props => props.marginRight ? '10px' : '0px'};
`;
