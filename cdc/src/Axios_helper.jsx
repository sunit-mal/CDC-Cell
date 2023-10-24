import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/';
// axios.defaults.headers.common['Content-Type'] = 'application/json';

export const getAuthTokens = () => {
    return window.localStorage.getItem('auth_token');
};

export const setAuthHeader = (token) => {
    window.localStorage.setItem('auth_token', token);
};

export const setUserDetails = (userDetails) => {
    window.localStorage.setItem('user_details', JSON.stringify(userDetails));
};

export const request = (method, url, type, data, responseType) => {

    let headers = {};
    if (getAuthTokens() !== null && getAuthTokens() !== "null") {
        headers = { 'Authorization': `Bearer ${getAuthTokens()}`, 'Content-Type': type };
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data,
        responseType: responseType
    });
};