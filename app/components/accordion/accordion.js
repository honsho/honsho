import React from 'react';

export class Accordion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }
    }

    toggleExpanded = () => this.setState({ expanded: !this.state.expanded });

    render() {
        return <div>
            <div onClick={this.toggleExpanded}>
                {this.props.header}
            </div>
            
            {this.state.expanded && <div>{this.props.items}</div>}
        </div>;
    }
}