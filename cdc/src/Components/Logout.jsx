import React from 'react'
import { successToastify } from './toastify'

function Logout() {

    const logout = () => {
        window.localStorage.removeItem('user_details');
        window.localStorage.removeItem('auth_header');
        window.localStorage.removeItem('auth_token');
    }

    React.useEffect(() => {
        logout();
    }, []);

    successToastify("Logout Successfully");

    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
    
    return (
        <></>
    )
}

export default Logout