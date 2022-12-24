import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import uncleLogo from './logo.png';
import { Home, Dashboard, NotFound, Login } from './pages';
import { getCookie, removeCookie } from './utils/cookie';

function App() {
  // TODO: store this in .env
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    const loginUrl = process.env.REACT_APP_LOGIN_URL as string;
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    const cookie = getCookie('access_token');
    if (!cookie) return;

    const payload = { access_token: cookie };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(
      `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/dashboard/logout`,
      options
    );
    removeCookie('access_token');
    setLoggedIn(false);
  };

  useEffect(() => {
    const cookie = getCookie('access_token');
    if (!cookie) setLoggedIn(false);
    else setLoggedIn(true);
  }, []);

  return (
    <Router>
      <NavBar
        icon={uncleLogo}
        title="Uncle"
        button={{
          label: !loggedIn ? 'Log in' : 'Log out',
          handleClick: !loggedIn ? handleLogin : handleLogout
        }}
      />
      <Routes>
        <Route path="/" element={loggedIn ? <Dashboard /> : <Home />} />
        <Route path="/login/:access_token" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
