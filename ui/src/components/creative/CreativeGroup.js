import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import CardColumn from 'react-bootstrap/CardColumns'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import ImageContentCard from './ContentCards';

class CreativeGroup extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            creative: this.props.creative
        }
    }

    render() {
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={this.state.creative.name}>{this.state.creative.name}</Accordion.Toggle>
                <Accordion.Collapse eventKey={this.state.creative.name}>
                    <Card.Body>
                        <Form.Row>
                            <Form.Group>
                                <Button variant='primary'>Add</Button>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <CardColumn>
                                    {this.state.creative.contents.map(content => (<ImageContentCard key={content.id} creative={this.state.creative} content={content} />))}
                                </CardColumn>
                            </Form.Group>
                        </Form.Row>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

        )
    }
}

export default CreativeGroup;