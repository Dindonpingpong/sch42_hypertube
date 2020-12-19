import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "reactstrap";

export const Info = (props) => {
    const [isVisible, setClose] = useState(true);
    const color = props.isSuccess ? 'success' : 'danger';

    useEffect(() => {
        if (isVisible && props.info === 'alert') {
            window.setTimeout(() => {
                setClose(!isVisible);
            }, 5000);
        }
    }, [isVisible]);

    if (props.info === 'message')
        return (
            <section className="page-state">
                <Container>
                    <Row>
                        <Col>
                            <Alert isOpen={isVisible} color={color}>{props.message}</Alert>
                        </Col>
                    </Row>
                </Container>
            </section>
        )
    else
        return (
            <Alert isOpen={isVisible} color={color}>{props.message}</Alert>
        );
}
