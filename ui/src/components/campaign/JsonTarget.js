import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class JsonTarget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.onModalValueChange = this.onModalValueChange.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.translateValue = this.translateValue.bind(this);
        this.filterChanged = this.filterChanged.bind(this);

        this.state = {
            original: this.props.target != null ? this.props.target : {},
            edit: false,
            updated: false,
            current: this.props.target != null ? { ...this.props.target } : {},
            show: false,
            modalValue: '',
            selectedValue: ''
        }
    }

    mapProperties(val) {
        let properties = []
        switch (val) {
            case 'geo':
                properties = ['country', 'region', 'metro', 'city', 'zip', 'isp', 'type']
                break;
            case 'user':
                properties = ['id', 'buyerId', 'yob', 'gender', 'keywords'];
                break;
            case 'app':
                properties = ['id', 'name', 'domain', 'appCategory', 'sectionCategory', 'pageCategory', 'version', 'bundle', 'isPaid', 'keywords', 'storeUrl'];
                break;
            case 'site':
                properties = ['id', 'name', 'domain', 'siteCategory', 'sectionCategory', 'pageCategory', 'page', 'referrerUrl', 'searchUrl', 'isMobileOptimized', 'keywords'];
                break;
            case 'impression':
                properties = ['id', 'displayManager', 'displayManagerVersion', 'isFullscreen', 'tagId', 'bidFloor', 'bidCurrency', 'iframeBusters', 'isSecure', 'isClickNative'];
                break;
            case 'device':
                properties = ['carrier', 'language', 'make', 'model', 'os', 'os_version', 'id', 'h', 'w', 'javascript', 'ppi'];
                break;
            default:
                console.warn('Unknown entity: ' + val);
                break;
        }

        return properties
    }

    filterChanged(e) {

        let current = this.state.current;

        switch (e.target.name) {
            case 'modifier':
                current[e.target.name] = parseFloat(e.target.value);
                break;
            case 'property':
            case 'operation':
            case 'entity':
                current[e.target.name] = e.target.value;
                break;
            case 'value':
                current[e.target.name] = e.target.value;
                break;
            case 'values':
                break;
            default:
                console.warn('Invalid target: ' + e.target.name);
                break;
        }

        this.setState({ current: current, updated: true })

        if (this.props.onChanged != null) {
            this.props.onChanged({ target: current, index: this.props.index })
        }
    }

    onModalValueChange(e) {
        this.setState({ modalValue: e.target.value })
    }

    translateValue(e) {
        try {
            if (e.target.value.includes('.')) {
                let val = parseFloat(e.target.value)
                if (!isNaN(val)) return val;
            }
        } catch (e) {

        }

        try {
            let val = parseInt(e.target.value)
            if (!isNaN(val)) return val;
        } catch (e) {

        }

        let val = e.target.value
        if (val === "true") return true;
        if (val === "false") return false;

        return val;
    }

    handleClose(e) {
        let current = this.state.current;
        let values = this.state.current.hasOwnProperty('values') ? this.state.current.values : []
        let newObj = {}

        try {
            if (this.state.modalValue.includes('.')) {
                newObj['dval'] = parseFloat(this.state.modalValue)
                if (isNaN(newObj.dval)) {
                    delete newObj.dval
                } else {
                    values.push(newObj)
                    current['values'] = values
                    this.setState({ show: false, modalValue: '', current: current, updated: true })
                    return
                }
            }
        } catch (e) {
            console.log('failed to parse as float: ' + this.state.modalValue)
        }

        try {
            newObj['ival'] = parseInt(this.state.modalValue)
            if (isNaN(newObj.ival)) {
                delete newObj.ival
            } else {
                values.push(newObj)
                current['values'] = values
                this.setState({ show: false, modalValue: '', current: current, updated: true })
                return
            }
        } catch (e) {
            console.log('failed to parse as int: ' + this.state.modalValue)
        }

        let val = this.state.modalValue

        if (val === 'true') {
            newObj['bval'] = true
        } else if (val === 'false') {
            newObj['bval'] = false
        } else {
            newObj['sval'] = val
        }
        values.push(newObj)
        current['values'] = values
        this.setState({ show: false, modalValue: '', current: current, updated: true })
    }

    removeValue(e) {
        console.log(JSON.stringify(this.state.selectedValue))
        if (this.state.selectedValue != null && this.state.current.hasOwnProperty('values')) {
            let values = this.state.current.values;

            let newValues = [];
            values.forEach((v) => {
                let val = this.extractValue(v);
                if (val != null && val !== this.state.selectedValue) {
                    newValues.push(v);
                }
            })

            let current = this.state.current;
            current['values'] = newValues;

            this.setState({ current: current, updated: true })
        }
    }

    extractValue(e) {
        if (e.hasOwnProperty('sval')) {
            return e.sval
        }
        if (e.hasOwnProperty('dval')) {
            return e.dval;
        }
        if (e.hasOwnProperty('bval')) {
            return e.bval
        }
        if (e.hasOwnProperty('ival')) {
            return e.ival;
        }
        if (e.hasOwnProperty('lval')) {
            return e.lval;
        }

        return null;
    }

    render() {

        var entity = this.state.current.hasOwnProperty('entity') ? this.state.current.entity : '';
        var property = this.state.current.hasOwnProperty('property') ? this.state.current.property : ''
        var operation = this.state.current.hasOwnProperty('operation') ? this.state.current.operation : 'eq';
        var multiplier = this.state.current.hasOwnProperty('modifier') ? this.state.current.modifier : 0;
        var value = null;
        var values = []

        if (this.state.current.hasOwnProperty('value'))
            values.push(this.extractValue(this.state.current.value))

        if (this.state.current.hasOwnProperty('values'))
            this.state.current.values.forEach(v => values.push(this.extractValue(v)));

        switch (operation) {
            case 'in':
            case 'notin':
                value = (
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Values</Form.Label>
                            <Form.Control as="select"
                                name='values'
                                onClick={(e) => this.setState({ selectedValue: this.translateValue(e) })}>
                                {values.map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Update</Form.Label>
                            <Form.Group>
                                <Button variant="primary" onClick={(e) => this.setState({ show: true })}>+</Button>
                                <Button variant="secondary" onClick={this.removeValue}>-</Button>
                            </Form.Group>
                        </Form.Group>
                        <Modal show={this.state.show} onHide={(e) => this.setState({ show: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Value</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><Form.Control as="input" type="text" onChange={this.onModalValueChange}></Form.Control></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={(e) => this.setState({ show: false })}>
                                    Close
                            </Button>
                                <Button variant="primary" onClick={this.handleClose
                                }>
                                    Save Changes
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    </Form.Row>);
                break;
            case 'hasvalue':
                break;
            default:
                value = (
                    <Form.Group as={Col}>
                        <Form.Label>Value</Form.Label>
                        <Form.Control as='input'
                            type='text'
                            name='value'
                            defaultValue={values.length > 0 ? values[0] : ''}
                            onChange={(e) => this.setState({ selectedValue: this.translateValue(e) })} />
                    </Form.Group>);
                break;
        }

        //style={{ width: '18rem' }}

        return (
            <Card border={this.state.updated ? "warning" : "light"} style={{
                'borderWidth': '3px'
            }
            }>
                <Card.Header>
                    <Form.Label>{entity + '.' + property + ' ' + operation}</Form.Label>
                    <Button className="float-right text-white" variant='danger' size='sm'>x</Button>
                </Card.Header>
                <Card.Body>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Entity</Form.Label>
                            <Form.Control as="select"
                                defaultValue={entity}
                                onChange={this.filterChanged}
                                name='entity'>
                                {['geo', 'user', 'impression', 'app', 'site', 'device'].map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Property</Form.Label>
                            <Form.Control as="select"
                                defaultValue={property}
                                onChange={this.filterChanged}
                                name='property'>
                                {this.mapProperties(entity).map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Operation</Form.Label>
                            <Form.Control as="select"
                                defaultValue={operation}
                                onChange={this.filterChanged}
                                name='operation'>
                                {['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'notin', 'hasvalue'].map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                        {value}
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Modifier</Form.Label>
                            <Form.Control as="input" type="text"
                                defaultValue={multiplier}
                                onChange={this.filterChanged}
                                name='modifier'></Form.Control>
                        </Form.Group>
                    </Form.Row>
                </Card.Body>
            </Card >
        );
    }
}

export default JsonTarget;