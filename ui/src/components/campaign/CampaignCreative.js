import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import CreativeGroup from '../creative/CreativeGroup'

class CampaignCreative extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);

        let currentJson = {}
        if (this.props.campaign != null) {
            currentJson['name'] = this.props.campaign.name;
        }

        let creatives = []
        this.props.campaign.creatives.forEach((e) => {
            creatives.push(this.props.creatives.find((c) => { return c.id === e; }));
        });

        this.state = {
            summary: this.props.summary,
            edit: false,
            campaign: this.props.campaign,
            current: currentJson,
            updated: false,
            creatives: creatives
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
                <Accordion.Toggle as={Card.Header} eventKey="creatives">Creative</Accordion.Toggle>
                <Accordion.Collapse eventKey="creatives">
                    <Card.Body>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Accordion>
                                {this.state.creatives.map(creative =>
                                    (
                                        <Form.Row key={creative.id} >
                                            <Form.Group as={Col}>
                                                <CreativeGroup creative={creative} />
                                            </Form.Group>
                                        </Form.Row>)
                                )}
                            </Accordion>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}

export default CampaignCreative;