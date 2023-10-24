import React from 'react'
import { Card, InputGroup, Form, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { request, setAuthHeader, setUserDetails } from '../Axios_helper'
import { successToastify, errorToastify } from './toastify'
import { GiArchiveRegister } from "react-icons/gi";

function Register() {

    const [passWarn, setPassWarn] = React.useState(false);

    const [state, setState] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value); // Add this line to debug
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onRegister = (e) => {
        if (isPasswordValid(state.password)) {
            setPassWarn(false)
            e.preventDefault();
            request(
                'post',
                '/register',
                'application/json',
                {
                    firstName: state.firstName,
                    lastName: state.lastName,
                    email: state.email,
                    password: state.password
                },
                'json'
            ).then((response) => {
                setAuthHeader(response.data.token);
                setUserDetails(response.data)
                successToastify("Register Successfully");
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);

            }).catch((error) => {
                window.localStorage.removeItem('user_details');
                window.localStorage.removeItem('auth_header');
                errorToastify(error.response.data.massage);
            });
        }
        else {
            setPassWarn(true)
        }
    };
    
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
        </Tooltip>
    );

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        return regex.test(password);
    };

    return (
        <div className='d-flex justify-content-center py-2'>
            <Card style={{ width: '30rem', backgroundColor: '#81f6cdb9' }} className='py-3 px-3 text-start'>
                <Card.Title className='text-center'><GiArchiveRegister size={80} /></Card.Title>
                <Form.Label htmlFor="inputFirstName">First Name</Form.Label>
                <Form.Control
                    placeholder="First Name"
                    aria-label="Recipient's firstName"
                    aria-describedby="basic-addon2"
                    type='text'
                    name='firstName'
                    onChange={onChangeHandler}
                />
                <Form.Label htmlFor="inputLastName">Last Name</Form.Label>
                <Form.Control
                    placeholder="Last Name"
                    aria-label="Recipient's lastName"
                    aria-describedby="basic-addon2"
                    type='text'
                    name='lastName'
                    onChange={onChangeHandler}
                />
                <Form.Label htmlFor="inputUsername">Email</Form.Label>
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
                        style={passWarn ? { borderColor: 'red' } : { borderColor: 'lightgray' }}
                    />
                </OverlayTrigger>
                <InputGroup className='my-3'>
                    <Button variant="primary" onClick={onRegister}>Register</Button>
                </InputGroup>

            </Card>
        </div>

    )
}

export default Register;