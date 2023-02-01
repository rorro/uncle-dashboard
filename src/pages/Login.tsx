import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import './pages.css';
import { setStorage } from '../utils/storage';

function Login() {
  const { access_token } = useParams();

  if (!access_token) {
    return <Navigate replace to="/" />;
  }

  setStorage('access_token', access_token);

  return <Navigate replace to="/" />;
}

export default Login;
