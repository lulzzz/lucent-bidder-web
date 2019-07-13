import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-jsonschema-form'
import { toUICampaign, getAllCampaigns, getCampaign, updateCampaign, fromUICampaign, createCampaign } from "./util"

import schema from './schemas/campaign.json'
import filterSchema from './schemas/filter.json'

class FilterEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let test;
        const onSubmit = ({ formData }) => {
            this.props.onSave(fromUICampaign(formData)).then(c => {
                if (c == null) alert('Failed!');
                try {
                    this.props.update(formData);
                } catch (error) {
                    test.click();
                }
            })
        }

        return (
            <Modal {...this.props} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body><Form schema={filterSchema}
                    onSubmit={onSubmit}
                    liveValidate={true} /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onClose} ref={(btn) => { test = btn }}>
                        Close
                        </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class CampaignCreate extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let test;
        const onSubmit = ({ formData }) => {
            this.props.onSave(formData);
        }

        return (
            <Modal {...this.props} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Campaign</Modal.Title>
                </Modal.Header>
                <Modal.Body><Form schema={schema}
                    onSubmit={onSubmit}
                    liveValidate={true} /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onClose} ref={(btn) => { test = btn }}>
                        Close
                        </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class CampaignEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let test;
        const onSubmit = ({ formData }) => {
            this.props.onSave(fromUICampaign(formData)).then(c => {
                if (c == null) alert('Failed!');
                try {
                    this.props.update(formData);
                } catch (error) {
                }
            })
        }

        return (
            <Modal {...this.props} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Campaign</Modal.Title>
                </Modal.Header>
                <Modal.Body><Form schema={schema}
                    formData={this.props.campaign}
                    onSubmit={onSubmit}
                    liveValidate={true} /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onClose} ref={(btn) => { test = btn }}>
                        Close
                        </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class CampaignSummary extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.editCampaign = this.editCampaign.bind(this);
        this.updateCampaignState = this.updateCampaignState.bind(this);

        this.state = {
            show: false,
            campaign: this.props.campaign,
            operation: 'unknown'
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleSave(campaign) {
        return updateCampaign(campaign);
    }

    handleShow() {
        this.setState({ show: true });
    }

    editCampaign() {
        getCampaign(this.state.campaign.id).then((c) => {
            this.setState({ operation: 'edit', campaign: toUICampaign(c) })
            this.handleShow();
        })
    }

    updateCampaignState(campaign) {
        this.setState({ campaign: toUICampaign(campaign), show: false })
    }

    render() {
        return (<tr class='m-1'>
            <th scope='row'>{this.state.campaign.id}</th>
            <th>{this.state.campaign.name}</th>
            <th>{this.state.campaign.status}</th>
            <th>{this.state.campaign.schedule.start}</th>
            <th>{this.state.campaign.schedule.end}</th>
            <th><button class={'btn btn-primary'} onClick={() => this.editCampaign()}>Edit</button>
                <CampaignEdit show={this.state.show} onHide={this.handleClose} update={this.updateCampaignState} onSave={this.handleSave} onClose={this.handleClose} campaign={this.state.campaign} />
            </th>
        </tr>)
    }
}

class CreateHolder extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.addCampaign = this.addCampaign.bind(this);
        this.handleTransition = this.handleTransition.bind(this);

        this.state = {
            show: false,
            showFilters: false,
            campaign: null
        }

    }

    handleClose() {
        this.setState({ show: false, showFilters: false });
    }

    handleSave(filters) {
        this.state.campaign.filters = filters
        return createCampaign(this.state.campaign);
    }

    handleTransition(campaign) {
        this.setState({ show: false, showFilters: true, campaign: campaign })
    }

    handleShow() {
        this.setState({ show: true });
    }

    addCampaign() {
        this.handleShow();
    }

    render() {
        return (<div class='container'>
            <button class='btn btn-primary' onClick={() => this.addCampaign()}>Create</button>
            <CampaignCreate show={this.state.show} onHide={this.handleClose} onSave={this.handleTransition} onClose={this.handleClose} />
            <FilterEdit show={this.state.showFilters} onHide={this.handleClose} onSave={this.handleSave} onClose={this.handleClose} />
        </div>);
    }

}

class Campaigns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            campaign: null,
            campaigns: null,
        }
    }

    componentDidMount() {
        getAllCampaigns().then(data => {
            this.setState({ campaigns: data });
        })
    }

    render() {
        if (this.state.campaigns == null)
            return (<div class='container'>Loading...</div>)

        return (<div class='container'>
            <CreateHolder />
            <table class="table table-hover">
                <caption>All campaigns</caption>
                <thead class='thead-light'>
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
                            return <CampaignSummary campaign={toUICampaign(item)} key={item.id} />
                        })
                    }
                </tbody>
            </table>
        </div>
        )
    }
}

export default Campaigns;