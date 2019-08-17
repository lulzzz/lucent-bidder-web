import React from 'react';
import { toUICampaign, getAllCampaigns, getCampaign, updateCampaign, fromUICampaign, createCampaign } from "../util"
import { Form, FormControl } from 'react-jsonschema-form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

class LucentSummary extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        let currentJson = {}
        if (this.props.campaign != null) {
            console.log(JSON.stringify(this.props.campaign))
            currentJson['name'] = this.props.campaign.name;
        }

        this.state = {
            summary: this.props.summary,
            edit: false,
            campaign: this.props.campaign,
            current: currentJson,
            updated: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            let campaign = this.state.campaign;
            if (campaign == null) campaign = {}
            campaign['name'] = this.state.current['name'];

            this.props.onUpdate(campaign)
            this.setState({ edit: false, campaign: campaign })
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

class LucentBudgeting extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            summary: this.props.summary
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    Budgets
                </div>
                <div className="card-body">
                    <h5 className="card-title">Special title treatment</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        );
    }
}

class CampaignSummary extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            campaign: this.props.campaign
        };
    }

    render() {

        return (<tr className='m-1' id={this.state.campaign.id} onClick={()=>this.props.showCampaign(this.state.campaign)}>
            <td scope='row'>{this.state.campaign.id}</td>
            <td>{this.state.campaign.name}</td>
            <td>{this.state.campaign.status}</td>
            <td>{this.state.campaign.schedule.start}</td>
            <td>{this.state.campaign.schedule.end}</td>
        </tr>)
    }
}

class Campaigns extends React.Component {
    constructor(props) {
        super(props);
        this.showCampaign = this.showCampaign.bind(this);
        this.state = {
            show: false,
            campaign: null,
            campaigns: null,
        }
    }

    showCampaign(e) {
        if(e == null) return
        console.log(e)
        if (this.state.campaigns != null){
            console.log('searching for campaign : ' + e.id)
            let c = this.state.campaigns.find((c) => { return c.id === e.id; })
            console.log(c)
            this.setState({ campaign: c })
        } else {
            console.log('fooey')
        }
    }

    componentDidMount() {
        getAllCampaigns().then(data => {
            this.setState({ campaigns: data });
        })
    }

    render() {
        if (this.state.campaigns == null)
            return (<div className='container'>Loading...</div>)

        if (this.state.campaign != null){
            console.log('returning summary')
            return (<LucentCampaign campaign={this.state.campaign} />)
        }

        return (<div className='container'>
            <table className="table table-hover">
                <caption>All campaigns</caption>
                <thead className='thead-light'>
                    <tr>
                        <th scope='col'>Id</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Start</th>
                        <th scope='col'>End</th>
                        <th scope='col'>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.campaigns.map((item, key) => {
                            return <CampaignSummary campaign={toUICampaign(item)} key={item.id} showCampaign={this.showCampaign} />
                        })
                    }
                </tbody>
            </table>
        </div>
        )
    }
}

class LucentCampaign extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            campaign: this.props.campaign,
            updated: false
        }
    }

    onUpdate(campaign) {
        this.setState({ campaign: campaign, updated: true })
    }

    render() {
        let updatePanel = this.state.updated ? <div className="row d-flex justify-content-center"><button className="btn btn-primary">Update</button><button className="btn btn-secondary">Cancel</button></div> : <div className="row"></div>;
        let currentView = 
            <div className="panel-group">
                {updatePanel}
                <div className="panel panel-default">
                    <div className="panel-body">
                        <LucentSummary campaign={this.state.campaign} onUpdate={this.onUpdate} />
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-body"><LucentBudgeting summary={null} /></div>
                </div>
            </div>;

        return currentView;
    }
}

export default Campaigns;