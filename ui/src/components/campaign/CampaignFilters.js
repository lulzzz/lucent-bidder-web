import React from 'react';
import JsonTarget from './JsonTarget'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import CardColumn from 'react-bootstrap/CardColumns'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'


class CampaignFilters extends React.Component {

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

        var filters = null;
        if (this.state.campaign.hasOwnProperty('jsonFilters')) {
            filters = []
            this.state.campaign.jsonFilters.forEach((filter, i) => {
                filters.push(<JsonTarget key={i} target={filter} index={i} />)
            });
        }

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="filters">Filters</Accordion.Toggle>
                <Accordion.Collapse eventKey="filters">
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
                                        {filters}
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

export default CampaignFilters;