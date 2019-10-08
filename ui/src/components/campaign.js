import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import CampaignTargets from './campaign/CampaignTargets'
import CampaignFilters from './campaign/CampaignFilters'
import CampaignCreative from './campaign/CampaignCreative';
import { updateCampaign, getCampaign } from '../util'

class CampaignSummary extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);

        let currentJson = {}
        if (this.props.campaign != null) {
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

    render() {
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="summary">Summary</Accordion.Toggle>
                <Accordion.Collapse eventKey="summary">
                    <Card.Body>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control as='input' type='text'
                                        defaultValue={this.state.current.name}
                                        onChange={(e) => {
                                            let current = this.state.current;
                                            current.name = e.target.value
                                            this.setState({ current: current, edit: true })
                                        }} />
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}

class CampaignBudget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        let currentJson = {}
        if (this.props.campaign != null) {
            currentJson['budgetSchedule'] = this.props.campaign.budgetSchedule;
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
            campaign['budgetSchedule'] = this.state.current['budgetSchedule'];

            this.props.onUpdate(campaign)
            this.setState({ edit: false, campaign: campaign })
        }
        else
            this.setState({ edit: false })
    }

    handleChange(e) {
        let v = parseInt(e.target.value)
        if (!isNaN(v)) {
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
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="budget">Budget</Accordion.Toggle>
                <Accordion.Collapse eventKey="budget">
                    <Card.Body>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control as='input' type='text'
                                        defaultValue={this.state.current.hasOwnProperty('budgetSchedule') ? this.state.current.budgetSchedule.hourly : 0}
                                        onChange={this.handleChange} />
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

        )
    }
}

class CampaignMetadata extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            campaign: this.props.campaign
        };
    }

    render() {

        return (<tr className='m-1' id={this.state.campaign.id} onClick={() => this.props.showCampaign(this.state.campaign)}>
            <td>{this.state.campaign.id}</td>
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
        this.hideCampaign = this.hideCampaign.bind(this);
        this.state = {
            show: false,
            campaign: null,
            campaigns: this.props.campaigns,
            creatives: this.props.creatives
        }
    }

    showCampaign(e) {
        if (e == null) return
        if (this.state.campaigns != null) {
            let c = this.state.campaigns.find((c) => { return c.id === e.id; })
            getCampaign(c.id).then(data => this.setState({ campaign: data }))
        } else {
            console.log('ERROR: This shouldn\'t be possible')
        }
    }

    hideCampaign() {
        this.setState({ campaign: null });
    }

    // componentDidMount() {
    //     getAllCampaigns().then(data => {
    //         this.setState({ campaigns: data });
    //     })
    // }

    render() {
        if (this.state.campaigns == null)
            return (<div className='container'>Loading...</div>)

        if (this.state.campaign != null) {
            return (
                <div className='container'>
                    <LucentCampaign campaign={this.state.campaign} creatives={this.state.creatives} />
                    <button className="btn-secondary" onClick={this.hideCampaign}>Back</button>
                </div>)
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
                        this.state.campaigns.map(item => {
                            return <CampaignMetadata campaign={item} key={item.id} showCampaign={this.showCampaign} />
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
        console.log('sending : ' + JSON.stringify(this.props.campaign))

        this.state = {
            campaign: {...this.props.campaign},
            creatives: this.props.creatives,
            updated: false
        }
    }

    onUpdate(campaign) {
        this.setState({ campaign: campaign, updated: true })
    }

    onTargetUpdate(targets) {
        console.log(JSON.stringify(targets));
        let campaign = this.state.campaign;
        campaign.targets = targets;

        updateCampaign(campaign).then(data => {
            console.log('Recieved: ' + JSON.stringify(data));
            this.setState({ campaign: data });
        })
    }

    render() {
        let currentView =
            <Accordion defaultActiveKey="campaign-summary">
                <CampaignSummary campaign={this.state.campaign} onUpdate={this.onUpdate} />
                <CampaignFilters campaign={this.state.campaign} onUpdate={this.onUpdate} />
                <CampaignTargets targets={this.state.campaign.jsonTargets || []} onUpdate={this.onTargetUpdate.bind(this)} />
                <CampaignBudget campaign={this.state.campaign} onUpdate={this.onUpdate} />
                <CampaignCreative campaign={this.state.campaign} creatives={this.state.creatives} onUpdate={this.onUpdate} />
            </Accordion>;

        return currentView;
    }
}

export default Campaigns;