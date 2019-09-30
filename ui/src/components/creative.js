import React from 'react';
import { toUICreative, getAllCreatives, getCreative, updateCreative, fromUICreative, createCreative } from "../util"
import { Form, FormControl } from 'react-jsonschema-form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

class CreativeSummary extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        let currentJson = {}
        if (this.props.creative != null) {
            console.log(JSON.stringify(this.props.creative))
            currentJson['name'] = this.props.creative.name;
        }

        this.state = {
            summary: this.props.summary,
            edit: false,
            creative: this.props.creative,
            current: currentJson,
            updated: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            let creative = this.state.creative;
            if (creative == null) creative = {}
            creative['name'] = this.state.current['name'];

            this.props.onUpdate(creative)
            this.setState({ edit: false, creative: creative })
        }
        else
            this.setState({ edit: false })
    }

    handleChange(e) {
        this.setState({ current: { [e.target.name]: e.target.value }, updated: true })
    }

    handleEdit() {
        this.setState({ edit: true })
    }

    render() {
        if (this.state.edit) {
            return (
                <div className="card">
                    <div className="card-header">Summary - Edit</div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <label htmlFor="name">Name</label>
                            <input id="name" name="name" type="text" defaultValue={this.state.current.hasOwnProperty('name') ? this.state.current.name : ''} onChange={this.handleChange} />
                            <input type="submit" />
                        </form>
                    </div>
                </div>
            )
        }

        return (
            <div className="card">
                <div className="card-header">Summary</div>
                <div className="card-body">
                    <div className="row">
                        <label>Name: <label>{this.state.current.hasOwnProperty('name') ? this.state.current.name : ''}</label></label>
                    </div>
                    <button onClick={this.handleEdit} className="btn btn-primary">Edit</button>
                </div>
            </div>
        );
    }
}

class CreativeBudget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        let currentJson = {}
        if (this.props.creative != null) {
            console.log(JSON.stringify(this.props.creative))
            currentJson['budgetSchedule'] = this.props.creative.budgetSchedule;
        }

        this.state = {
            summary: this.props.summary,
            edit: false,
            creative: this.props.creative,
            current: currentJson,
            updated: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            let creative = this.state.creative;
            if (creative == null) creative = {}
            creative['budgetSchedule'] = this.state.current['budgetSchedule'];

            this.props.onUpdate(creative)
            this.setState({ edit: false, creative: creative })
        }
        else
            this.setState({ edit: false })
    }

    handleChange(e) {
        let v = parseInt(e.target.value)
        if (v != NaN) {
            let currentJson = this.state.current.budgetSchedule;
            if (currentJson == null) currentJson = {}
            currentJson[e.target.name] = v
            this.setState({ current: { budgetSchedule: currentJson }, updated: true })
        }
    }

    handleEdit() {
        this.setState({ edit: true })
    }

    render() {
        console.log(this.state.current)
        return (
            <div className="card">
                <div className="card-header">Budget - Edit</div>
                <div className="card-body">
                    <form {...this.state.edit ? {} : { readOnly: true }} onSubmit={this.handleSubmit}>
                        <div className="row">
                            <label htmlFor="hourly">Hourly</label>
                            <input id="hourly" name="hourly" type="number" defaultValue={this.state.current.hasOwnProperty('budgetSchedule') ? this.state.current.budgetSchedule.hourly : 0} onChange={this.handleChange} />
                        </div>
                        <div className="row">
                            <input type="submit" />
                        </div>
                    </form>
                    {this.state.edit ? null : <button onClick={this.handleEdit} className="btn btn-primary">Edit</button>}
                </div>
            </div>
        )
    }
}

class ContentMetadata extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            content: this.props.content,
            name: this.props.name
        };
    }

    render() {

        return (<tr className='m-1' id={this.state.content.id}>
            <td>{this.state.name}</td>
            <td scope='row'>{this.state.content.id}</td>
            <td>{this.state.content.mime_type}</td>
            <td>{this.state.content.h}x{this.state.content.w}</td>
        </tr>)
    }
}

class Creatives extends React.Component {
    constructor(props) {
        super(props);
        this.showCreative = this.showCreative.bind(this);
        this.hideCreative = this.hideCreative.bind(this);
        this.state = {
            show: false,
            creative: null,
            creatives: this.props.creatives,
        }
    }

    showCreative(e) {
        if (e == null) return
        console.log(e)
        if (this.state.creatives != null) {
            console.log('searching for creative : ' + e.id)
            let c = this.state.creatives.find((c) => { return c.id === e.id; })
            console.log(c)
            this.setState({ creative: c })
        } else {
            console.log('fooey')
        }
    }

    hideCreative() {
        this.setState({ creative: null });
    }

    render() {
        if (this.state.creatives == null)
            return (<div className='container'>Loading...</div>)

        if (this.state.creative != null) {
            console.log('returning summary')
            return (<div className='container'><LucentCreative creative={this.state.creative} /><button className="btn-secondary" onClick={this.hideCreative}>Back</button></div>)
        }
        console.log(this.state.creatives);

        return (<div className='container'>
            <table className="table table-hover">
                <caption>All creative</caption>
                <thead className='thead-light'>
                    <tr>
                        <th scope='col'>Creative</th>
                        <th scope='col'>Id</th>
                        <th scope='col'>Mime</th>
                        <th scope='col'>Size</th>
                        <th scope='col'>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.creatives.map((item) => {
                            return item.contents != null ? item.contents.map((content)=>{
                                return (<ContentMetadata name={item.name} content={content} key={item.id} showCreative={this.showCreative} />)
                            }) : null
                        })
                    }
                </tbody>
            </table>
        </div>
        )
    }
}

class LucentCreative extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            creative: this.props.creative,
            updated: false
        }
    }

    onUpdate(creative) {
        this.setState({ creative: creative, updated: true })
    }

    render() {
        let updatePanel = this.state.updated ? <div className="row d-flex justify-content-center"><button className="btn btn-primary">Update</button><button className="btn btn-secondary">Cancel</button></div> : <div className="row"></div>;
        let currentView =
            <div className="panel-group">
                {updatePanel}
                <div className="panel panel-default">
                    <div className="panel-body">
                        <CreativeSummary creative={this.state.creative} onUpdate={this.onUpdate} />
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <CreativeBudget creative={this.state.creative} onUpdate={this.onUpdate} />
                    </div>
                </div>
            </div>;

        return currentView;
    }
}

export default Creatives;