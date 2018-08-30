import axios from 'axios';

const url = 'http://127.0.0.1:5000';
const loginUrl = `${url}/api/v1/auth/login`;
const signUpUrl = `${url}/api/v1/auth/signup`;

export function loginApi(loginData) {
  return axios.post(loginUrl, loginData);
}

export function signUpApi(signUpData) {
  return axios.post(signUpUrl, signUpData);
}

export function setAuthorizationToken(token){
  if(token){
    axios.defaults.headers.common['access-token'] = `${token}`;
  }
  else {
    delete axios.defaults.headers.common['access-token'];
  }
}
