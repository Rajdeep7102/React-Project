import React, { useState } from 'react';
import { useNavigate,Navigate } from "react-router-dom";
import Footer from '../components/Footer';
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password , email}),
        headers: { 'Content-Type': 'application/json' },
      }); 
      
      
       if (response.ok) {
          console.log('Registration successful');
          setRedirect(true);
          
          
          // Optionally, redirect to another page or perform additional actions upon successful registration
       } else {
          console.error('Registration failed:', await response.text());
          // Handle registration failure, show an error message, etc.
       }
    } catch (error) {
       console.error('Error during registration:', error);
    }
 }
   if (redirect) {
    return <Navigate to={'/BlogPage'} />;
  }
 
  return (
    <> 
    <form className='register pb-60 pt-10' onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder='username'
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="email"
        placeholder='email'
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <input
        type="password"
        placeholder='password'
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button className='registerButton'>Register</button>
    </form>
    <Footer/>
    </>
  );
};

export default Register;
