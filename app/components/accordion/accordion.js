import React from 'react';
import { AccordionWrapper } from './accordion-wrapper';
import { AccordionHeader } from './accordion-header';
import { AccordionItems } from './accordion-items';

export class Accordion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }
    }

    toggleExpanded = () => this.props.items.length && this.setState({ expanded: !this.state.expanded });

    render() {
        return <AccordionWrapper>
            <AccordionHeader onClick={this.toggleExpanded}>
                {this.props.header}
            </AccordionHeader>
            
            {this.state.expanded && !!this.props.items.length && <AccordionItems>{this.props.items}</AccordionItems>}
        </AccordionWrapper>;
    }
}