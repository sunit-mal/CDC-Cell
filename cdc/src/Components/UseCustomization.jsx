import React from 'react'
import { request } from '../Axios_helper'
import { errorToastify } from './toastify';
import { Table, Button } from 'react-bootstrap';

function UseCustomization() {
    const [user, setUser] = React.useState(null);
    const [userDetails, setUserDetails] = React.useState({
        Name: '',
        Email: '',
        userName: '',
        userType: ''
    });

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
        }
    }, [userDetails.userName]);

    React.useEffect(() => {
        if (userDetails.userName !== null && userDetails.userName !== '') {
            fetchAll(userDetails.userName);
        } else {
            console.log("user not found");
        }
    }, [userDetails.userName]);

    const fetchAll = (username) => {
        const path = "/userControl/getUsers/" + username;
        request(
            'get',
            path,
            'application/json',
            {},
            'json'
        ).then((res) => {
            if (res.status === 200) {
                setUser(res.data);
            }
            if (res.status === 204) {
                errorToastify("You are not authorized to access this page")
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }

        }).catch((err) => {
            console.log(err.response.data.message);
        })
    };

    const userTypeChange = (targetUser, userType) => {
        request(
            'POST',
            'userControl/change/' + userDetails.userName,
            'application/json',
            {
                'username': targetUser,
                'userType': userType
            },
            'json'
        ).then((response) => {
            fetchAll(userDetails.userName)
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    };

    const userDelete = (targetUser, userType) => {
        request(
            'delete',
            'userControl/delete/' + userDetails.userName,
            'application/json',
            {
                'username': targetUser,
                'userType': userType
            },
            'json'
        ).then((response) => {
            fetchAll(userDetails.userName)
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>User Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {user !== null && user.map((item, index) => (
                        <tr>
                            <td>{index}</td>
                            <td>{item.username}</td>
                            <td>{item.userType}</td>
                            <td>
                                <Button variant="success" className='my-1' onClick={() => userTypeChange(item.username, item.userType)}>Change User Type</Button><br />
                                <Button variant="danger" className='my-1' onClick={() => userDelete(item.username, item.userType)}>Delete User</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default UseCustomization