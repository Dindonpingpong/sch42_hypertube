import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Alert, Container, Row, Col, Nav, NavItem, NavLink, Card, CardImg, CardBody, TabContent, TabPane, Button, Media, Input, Label,
    UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import classnames from 'classnames';
import { fetchProfile, fetchView, fetchLike, fetchStatus, fetchUpdateStatus, fetchUpdateView, fetchReport } from '../redux/profile/ActionCreators';
import { fetchUpdateLogin } from '../redux/login/ActionCreators';
import { Loading } from './Loading';
import { Info } from './Info';
import NotFound from './NotFound';
import { request } from '../util/http';
import moment from 'moment';
import CONFIG from '../util/const';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        profile: state.profile
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUpdateLogin: (nickname) => dispatch(fetchUpdateLogin(nickname)),
    fetchProfile: (nickname) => dispatch(fetchProfile(nickname))
});

const Avatar = (props) => {
    const putPhoto = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = e.target.files[0].type;
            if (!type.match("image/png") && !type.match("image/jpeg") && !type.match("image/jpg")) {
                alert('Wrong format!');
                return;
            }
            let formData = new FormData();
            formData.append('photo', file);
            request(`${CONFIG.API_URL}/api/image/${props.username}`, formData, 'POST', 'image')
                .then(data => {
                    // if (data) {
                    //     props.fetchProfile(props.me);
                    //     props.fetchUpdateLogin(props.me);
                    // }
                })
                .catch(e => {
                    alert(e.message);
                })
        }
    }

    return (
        <Card className="mb-4 shadow-sm">
            <CardImg src={`${CONFIG.API_URL}/api/image/${props.username}`} alt={"Photo profile"} />
            {
                props.check &&
                <CardBody>
                    <div className="d-flex justify-content-center">
                        <Label className="btn btn-sm btn-success">Add
                                    <Input className="profile-input" type="file" onChange={putPhoto} />
                        </Label>
                    </div>
                </CardBody>
            }
        </Card>
    )
}

function Report(props) {
    const [modal, setModal] = useState(false);
    const [reason, setReason] = useState("pornography");
    const [message, setMessage] = useState();

    const toggleModal = () => setModal(!modal);

    const reportSubmit = () => {
        const data = {
            me: props.me,
            you: props.you,
            reason: reason,
            message: message
        }
        props.fetch(data);
        setModal(!modal);
    }

    return (
        <div>
            <UncontrolledButtonDropdown>
                <DropdownToggle caret></DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={toggleModal}>Report page</DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
            <Modal isOpen={modal}>
                <ModalHeader>Report user</ModalHeader>
                <ModalBody>
                    <p>Please, let us know the reason why this user should be blocked:</p>
                    <Input className="modal-item" type="select" onChange={e => setReason(e.target.value)}>
                        <option value="pornography">Pornography</option>
                        <option value="spam">Spam</option>
                        <option value="offensive behavior">Offensive behavior</option>
                        <option value="fraud">Fraud</option>
                    </Input>
                    <Input type="textarea" placeholder="Descride the reason for the report" rows={5} onChange={e => setMessage(e.target.value)} />
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button color="success" onClick={reportSubmit} reason={reason} message={message} >Report</Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const Profile = (props) => {
    const login = props.login.me;
    const { nickname } = props.match.params;
    const { fetchProfile } = props;

    console.log("profile", props);
    useEffect(() => {
        fetchProfile(nickname);
    }, [nickname]);

    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    if (props.profile.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.profile.errProfile) {
        return (
            <Info />
        );
    }
    else if (props.profile.info != null) {
        const isMe = (props.login.me === nickname);

        return (
            <section className="profile text-break">
                <Container>
                    <Row>
                        <Avatar username={nickname} check={isMe} />
                        <Col className="col-lg-3">
                            {
                                props.profile.info.avatar &&
                                <img src={`/api/image/${props.profile.info.username}/1/${props.profile.info.avatar}`} alt={`Avatar ${props.profile.info.username}`} className="mx-auto d-block profile-avatar rounded-circle" />
                            }
                        </Col>
                        <Col ls="9" className="font-profile-head">
                            <h2>{props.profile.info.username}</h2>
                            <p>{props.profile.info.firstname} {props.profile.info.lastname}</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p className="font-profile-head">About</p>
                            <p>{props.profile.info.about}</p>
                        </Col>
                    </Row>

                    <p className="font-profile-head">Photo</p>

                    <Row className="profile-tabs">
                        <Col>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}>
                                        Films
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}>
                                        Comments
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => { toggle('3'); }}>
                                        Friends
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    {/* <ViewsList myviews={props.profile.views} /> */}
                                </TabPane>
                                <TabPane tabId="2">
                                    {/* <LikesList mylikes={props.profile.likes} /> */}
                                </TabPane>
                                <TabPane tabId="3">
                                    {/* <LikesList mylikes={props.profile.likes} /> */}
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
    else
        return (
            <NotFound />
        );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
