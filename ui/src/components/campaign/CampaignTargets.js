import React from 'react';
import JsonTarget from './JsonTarget'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import CardColumn from 'react-bootstrap/CardColumns'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

class CampaignTargets extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);

        let targets = []
        this.props.targets.forEach(t => targets.push(t));

        this.state = {
            targets: targets,
            updated: false,
        }
    }

    componentWillReceiveProps(newProps){
        this.setState({updated: JSON.stringify(newProps.targets) !== JSON.stringify(this.state.targets)})
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            this.props.onUpdate(this.state.targets)
            this.setState({ edit: false })
        }
        else
            this.setState({ edit: false })
    }

    targetChanged(e) {
        let targets = this.state.targets;
        targets[e.index] = e.target;
        this.setState({ targets: targets, updated: true })
    }

    render() {

        var targets = [];
        this.props.targets.forEach((target, i) => {
            targets.push(<JsonTarget key={i} target={target} index={i} onChanged={this.targetChanged.bind(this)} />)
        });

        var submit = null;
        if (this.state.updated)
            submit = (<Button variant='success' type='submit'>Save</Button>)

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="targets">Targets</Accordion.Toggle>
                <Accordion.Collapse eventKey="targets">
                    <Card.Body>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group>
                                    <ButtonToolbar>
                                        <Button variant='primary'>Add</Button>
                                        {submit}
                                    </ButtonToolbar>
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