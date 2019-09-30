import React, { Component } from 'react';

class SelectInput extends Component {

    constructor(props, context) {
        super(props, context);

        var opts = props.options != null ? props.options : [];
        var dOpt = props.defaultOption != null ? props.defaultOption : "choose one"
        var onChange = props.onChange != null ? props.onChange : (e) => { }

        this.state = {
            options: opts,
            defaultOption: dOpt,
            id: this.props.id,
            value: this.props.value,
            onChange: onChange
        }
    }

    componentWillReceiveProps(props) {
        this.setState({...this.state, ...props})
    }

    render() {
        let opts = []
        {
            this.state.options.forEach((e, i) => {
                opts.push(<option key={e} value={e}>{e}</option>)
            })
        }

        return (
            <select className="browser-default custom-select" key={this.state.id} defaultValue={this.state.value} onChange={this.state.onChange}>
                <option key='default' disabled>{this.state.defaultOption}</option>
                {opts}
            </select>
        );
    }
}

export default SelectInput;