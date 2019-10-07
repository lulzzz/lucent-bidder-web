import React from 'react';
import JsonTarget from './JsonTarget'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import CardColumn from 'react-bootstrap/CardColumns'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'

class CampaignTargets extends React.Component {

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

    targetChanged(e) {
        console.log('Recieved: ' + JSON.stringify(e.target))
        console.log('Previous: (' + e.index + ') ' + JSON.stringify(this.state.campaign.jsonTargets[e.index]))
    }

    render() {

        var targets = null;
        if (this.state.campaign.hasOwnProperty('jsonTargets')) {
            targets = []
            this.state.campaign.jsonTargets.forEach((target, i) => {
                targets.push(<JsonTarget key={i} target={target} index={i} onChanged={this.targetChanged.bind(this)} />)
            });
        }

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="targets">Targets</Accordion.Toggle>
                <Accordion.Collapse eventKey="targets">
                    <Card.Body>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group>
                                    <Button variant='primary'>Add</Button>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <CardColumn>
                                        {targets}
                                    </CardColumn>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}

export default CampaignTargets;