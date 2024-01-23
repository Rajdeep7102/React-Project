import React from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom'; // Make sure to import Navigate from react-router-dom
import Cookies from 'js-cookie';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password}),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      Cookies.set('loggedInUsername', username,{expires:1});  
      setRedirect(true);
      
    }
    else{

    }
  }

  if (redirect) {
    return <Navigate to={'/BlogPage'} />;
  }

  return (
    <form className='login' onSubmit={login}>
      <h1>Login</h1>
      <input
        type='text'
        placeholder='username'
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button className='loginButton'>Login</button>
    </form>
  );
};

export default UserLogin;
