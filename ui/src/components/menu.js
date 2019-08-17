import React from 'react';
import ReactDOM from 'react-dom';
import { Form, FormControl } from 'react-jsonschema-form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Campaigns from './campaign'

class LucentMenu extends React.Component {

    render() {
        const handleSelect = eventKey => {
            switch (eventKey) {
                case "Campaigns":
                    ReactDOM.render(<Campaigns />, document.getElementById('contents'));
                    break;
                default:
                    let element = document.getElementById("contents");
                    if (element.firstChild) {
                        ReactDOM.unmountComponentAtNode(element)
                    }
                    break;
            }
        }

        return (
            <Navbar bg="light" variant="light" expand="lg" >
                <Navbar.Brand><img src="/images/lucent-logo.svg" style={{ height: '75px' }} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav fill variant="tabs" defaultActiveKey="/home" onSelect={handleSelect}>
                        <Nav.Item>
                            <Nav.Link eventKey="Dashboard">Dashboard</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Exchanges">Exchanges</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Campaigns">Campaigns</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Creatives">Creatives</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="disabled" disabled>Disabled</Nav.Link>
                        </Nav.Item>
                        <NavDropdown title="Dropdown" id="nav-dropdown">
                            <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar >
        );
    }
}

export default LucentMenu;