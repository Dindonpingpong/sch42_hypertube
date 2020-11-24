import React from 'react';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap';

const LoginInput = () => {

    return (
        <Col>
            <FormGroup>
                <Label className="font-profile-head">Login
                <Input
                        type="text"
                        name="Login"
                        placeholder="rkina7"
                        required
                    />
                </Label>
            </FormGroup>
        </Col>
    )
}

const Password = () => {

    return (
        <Col>
            <FormGroup>
                <Label className="font-profile-head">Password
                <Input
                        type="password"
                        name='password'
                        placeholder="Str0ngPa55%"
                        required
                    />
                </Label>
            </FormGroup>
        </Col>
    )
}

const Login = () => {

    const handle = (e) => {
        console.log(e.target.name);
        window.open(`http://localhost:5000/api/login/${e.target.name}`, "_self");
    }

    return (
        <section className="login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card>
                            <CardBody>
                                <LoginInput />
                                <Password />
                                <Row>
                                    <Col xs={3}>
                                        <Button className="login-btn" color="info">Sign in</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button className="login-btn" color="info" name="facebook" onClick={handle}>Via FB</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button className="login-btn" color="info" name="github" onClick={handle}>Via Github</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button className="login-btn" color="info" name="intra" onClick={handle}>Via school42</Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Login;
