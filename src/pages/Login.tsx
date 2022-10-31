import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import './pages.css';
import { setCookie } from '../utils/cookie';

function Login() {
  const { access_token } = useParams();

  if (!access_token) {
    return <Navigate replace to="/" />;
  }

  setCookie('access_token', access_token);

  return <Navigate replace to="/" />;
}

export default Login;
