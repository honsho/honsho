import styled from 'styled-components';
import { Input } from './../input';

export const WorkplaceImageCleanerErrorDelta = Input.extend.attrs({
    type: 'number',
    min: 0,
    max: 255
})`
    margin-left: 5px;
`;