import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import uncleLogo from './logo.png';
import { Home, Dashboard, NotFound, Login } from './pages';
import { getStorage, removeStorage } from './utils/storage';

function App() {
  // TODO: store this in .env
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    const loginUrl = process.env.REACT_APP_LOGIN_URL as string;
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    const token = getStorage('access_token');
    if (!token) return;

    const payload = { access_token: token };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/logout`,
      options
    );
    removeStorage('access_token');
    setLoggedIn(false);
  };

  useEffect(() => {
    const token = getStorage('access_token');
    if (!token) setLoggedIn(false);
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
