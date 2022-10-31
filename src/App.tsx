import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import uncleLogo from './logo.png';
import { Home, Dashboard, NotFound, Login } from './pages';
import { getCookie, removeCookie } from './utils/cookie';

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    const loginUrl =
      'https://discord.com/api/oauth2/authorize?client_id=969344573514088508&redirect_uri=http%3A%2F%2Flocalhost%3A7373%2Fdashboard%2Fauth&response_type=code&scope=identify';
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

    fetch('http://localhost:7373/dashboard/logout', options);
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
