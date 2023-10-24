import React from 'react'
import Profile from './Profile'
import MyNavBar from './MyNavBar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './HomePage';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';
import { ToastContainer } from 'react-toastify';
import JobRegister from './JobRegister';
import UseCustomization from './UseCustomization';

function AppControl() {
    return (
        <>
            <Router>
                <MyNavBar />
                <Routes>
                    <Route exact path='/jobRegister' element={<JobRegister />} />
                    <Route exact path='/userCustomization' element={<UseCustomization />} />
                    <Route exact path='/Profile/:userEmail' element={<Profile />} />
                    <Route exact path='/Login' element={<Login />} />
                    <Route exact path='/logout' element={<Logout />} />
                    <Route exact path='/register' element={<Register />} />
                    <Route exact path='/' element={<HomePage />} />
                </Routes>
            </Router>
            <ToastContainer />
        </>
    )
}

export default AppControl