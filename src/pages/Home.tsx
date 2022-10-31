import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import './pages.css';
import uncleLogo from '../../src/logo.png';
import { getCookie } from '../utils/cookie';
import useFetch from '../hooks/useFetch';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="container">home page</div>
    </div>
  );
}

export default Home;
