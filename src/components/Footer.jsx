import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="bg-dark text-light mt-5">
            <Container>
                <Row>
                    <Col md={6} className="text-center text-md-left my-3">
                        <h5>Company Name</h5>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                            euismod, justo ut congue blandit.
                        </p>
                        <address>
                            <p>123 Main Street</p>
                            <p>City, State 12345</p>
                        </address>
                    </Col>
                    <Col md={6} className="text-center text-md-right my-3">
                        <h5>Contact Us</h5>
                        <p>Email: info@example.com</p>
                        <p>Phone: (123) 456-7890</p>
                    </Col>
                </Row>
            </Container>
            <div className="bg-secondary py-2">
                <Container>
                    <Row>
                        <Col className="text-center">
                            &copy; {new Date().getFullYear()} Company Name. All Rights
                            Reserved.
                        </Col>
                    </Row>
                </Container>
            </div>

        </footer>
    );
}

export default Footer;
