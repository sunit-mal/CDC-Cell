import React from 'react'
import { Card, InputGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { request, setAuthHeader, setUserDetails } from '../Axios_helper'
import { successToastify, errorToastify } from './toastify'
import { BiSolidUserAccount } from "react-icons/bi";

function Login() {


    const [state, setState] = React.useState({
        email: '',
        password: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onLogin = (e) => {
        e.preventDefault();
        request(
            'post',
            '/login',
            'application/json',
            {
                email: state.email,
                password: state.password
            },
            'json'
        ).then((response) => {
            setAuthHeader(response.data.token);
            setUserDetails(response.data)
            successToastify("Login Successfully");
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        }).catch((error) => {
            window.localStorage.removeItem('user_details');
            window.localStorage.removeItem('auth_header');
            errorToastify(error.response.data.massage);
        });
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Password must be 8-20 characters long, contain letters and numbers.
        </Tooltip>
    );

    return (
        <div className='d-flex justify-content-center py-3'>
            <Form>
                <Card style={{ width: '30rem', backgroundColor: '#81f6cdb9' }} className='py-3 px-3 text-start'>
                    <Card.Title className='text-center'>
                        <BiSolidUserAccount size={120} />
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-center">
                        Login To CDC
                    </Card.Subtitle>
                    <Form.Label htmlFor="inputUsername my-3">Email</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="example"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            name='email'
                            onChange={onChangeHandler}
                        />
                    </InputGroup>
                    <Form.Label htmlFor="inputPassword">Password</Form.Label>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >

                        <Form.Control
                            placeholder="password"
                            aria-label="Recipient's password"
                            aria-describedby="basic-addon2"
                            type='password'
                            name='password'
                            onChange={onChangeHandler}
                        />

                    </OverlayTrigger>
                    {/* <InputGroup>
                        <Button variant="primary" onClick={onLogin} className='my-3'>Login</Button>
                    </InputGroup> */}
                    <Form.Group className="mb-3 my-3" controlId="exampleForm.ControlInput1">
                        <Form.Control type="submit" value='Login' onClick={onLogin} />
                    </Form.Group>
                </Card>
            </Form>
        </div>

    )
}

export default Login