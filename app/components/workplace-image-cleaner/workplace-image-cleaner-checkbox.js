import styled from 'styled-components';

export const WorkplaceImageCleanerCheckbox = styled.input.attrs({
    type: 'checkbox',
    title: props => `${(props.checked ? 'Включить' : 'Выключить')} улучшение распознавания`
})``;