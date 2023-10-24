import React from 'react'
import { Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { request } from '../Axios_helper'

function MyNavBar() {
    // eslint-disable-next-line
    const [suggestions, setSuggestions] = React.useState([]);
    const [authStatus, setAuthStatus] = React.useState(false);
    const [value, setValue] = React.useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const onSearch = () => {
        window.location.href = "/profile/" + value;
        // console.log(value);
    }

    const selectSearchValue = (event) => {
        setValue(event.target.innerText);
    }

    const [userDetails, setUserDetails] = React.useState({
        Name: '',
        Email: '',
        userName: '',
        userType: ''
    });



    const [username, setUsername] = React.useState('example@gmail.com');
    React.useEffect(() => {
        const userDetailsString = window.localStorage.getItem('user_details');
        if (userDetailsString !== null) {
            const userDetail = JSON.parse(userDetailsString);
            setUserDetails({
                Name: userDetail.firstName + " " + userDetail.lastName,
                Email: userDetail.email,
                userName: userDetail.email,
                userType: userDetail.userType
            })
            setUsername(userDetail.email);
        }
    }, [userDetails.userName]);

    React.useEffect(() => {
        const authToken = window.localStorage.getItem('auth_token');
        if (authToken !== null) {
            setAuthStatus(true);
        }
    }, [userDetails.userName]);

    React.useEffect(() => {
        request(
            'get',
            '/basicimformation/searchItems',
            'application/json',
            {},
            {},
        ).then((response) => {
            if (response.status === 200) {
                return response.data;
            }
        }).then((data) => {
            const values = Array.isArray(data) ? data : data.split("\"");
            const DATA = [];
            values.forEach((value) => {
                if (value.includes("@")) {
                    DATA.push(value);
                }
            });
            setSuggestions(DATA);
        });
    }, [value]);

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#">CDC Cell</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="/">Home</Nav.Link>
                            {userDetails.userType === "ADMINISTRATOR" || userDetails.userType === 'editor' ? (
                                <Nav.Link href="/jobRegister">Job Handling</Nav.Link>
                            ) : (
                                <Nav.Link href={"/profile/" + username}>Profile</Nav.Link>
                            )}
                            {userDetails.userType === "ADMINISTRATOR" ? (
                                <Nav.Link href="/userCustomization">User Handling</Nav.Link>
                            ) : (
                                null
                            )}
                            <NavDropdown title="Account" id="navbarScrollingDropdown">
                                {!authStatus ? (
                                    <>
                                        <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
                                        <NavDropdown.Item href="/register">Register</NavDropdown.Item>
                                    </>
                                ) : (
                                    <NavDropdown.Item href="/logout">
                                        Logout
                                    </NavDropdown.Item>
                                )}
                            </NavDropdown>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={value}
                                onChange={onChange}
                            />
                            <div className="mydropdown position-absolute top-100" style={{ zIndex: '999' }}>
                                {suggestions.filter(suggestion => {
                                    const searchItem = value.toLowerCase();
                                    const suggestionItem = suggestion.toLowerCase();
                                    return searchItem && suggestionItem.startsWith(searchItem);
                                })
                                    .map((suggestion) => (
                                        <div className="mydropdown-row px-3" onClick={selectSearchValue}>
                                            {suggestion}
                                        </div>
                                    ))}
                            </div>
                            <Button variant="outline-success" onClick={onSearch}>Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default MyNavBar