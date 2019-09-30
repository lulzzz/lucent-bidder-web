import React from 'react';
import JsonTarget from './targets'

class CampaignSummary extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);

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

        var targets = null;
        if (this.state.campaign.hasOwnProperty('jsonTargets')) {
            targets = []
            this.state.campaign.jsonTargets.forEach((target, i) => {
                targets.push(<JsonTarget key={i} target={target} index={i} />)
            });
        }

        return (
            <div className="card">
                <div className="card-header" id="headingOne">
                    <h5 className="mb-0">
                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Summary
                </button>
                    </h5>
                </div>
                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                    <div className="card-body">
                        <div className="row">
                            <label>Name: <label>{this.state.current.hasOwnProperty('name') ? this.state.current.name : ''}</label></label>
                        </div>
                        <div className="row">
                            {targets}
                        </div>
                        <button onClick={this.handleEdit} className="btn btn-primary">Edit</button>
                    </div>
                </div>
            </div>
        );
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
        return (
            <div className="card">
                <div className="card-header" id="headingTwo">
                    <h5 className="mb-0">
                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            Budget
            </button>
                    </h5>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
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
            </div>
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
        this.hideCampaign = this.hideCampaign.bind(this);
        this.state = {
            show: false,
            campaign: null,
            campaigns: this.props.campaigns,
        }
    }

    showCampaign(e) {
        if (e == null) return
        if (this.state.campaigns != null) {
            let c = this.state.campaigns.find((c) => { return c.id === e.id; })
            this.setState({ campaign: c })
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
                    <LucentCampaign campaign={this.state.campaign} />
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
                        this.state.campaigns.map((item, key) => {
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
            <div id="accordion">
                {updatePanel}
                <CampaignSummary campaign={this.state.campaign} onUpdate={this.onUpdate} />
                <CampaignBudget campaign={this.state.campaign} onUpdate={this.onUpdate} />
            </div>;

        return currentView;
    }
}

export default Campaigns;