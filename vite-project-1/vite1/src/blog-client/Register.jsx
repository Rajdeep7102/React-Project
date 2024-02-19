import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
          navigate("/");
          
          // Optionally, redirect to another page or perform additional actions upon successful registration
       } else {
          console.error('Registration failed:', await response.text());
          // Handle registration failure, show an error message, etc.
       }
    } catch (error) {
       console.error('Error during registration:', error);
    }
 }
 
  return (
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
  );
};

export default Register;


// import React from 'react'
// import { useState } from 'react'
// const Register = () => {
//   const [username,setUsername] = useState('');
//   const [password,setPassword] = useState('');
//   async function register(ev){
//     ev.preventDefault();
//     await fetch('http://localhost:5173/register',{
//       method:'POST',
//       body: JSON.stringify({username,password}),
//       headers:{'Content-Type':'application/json'},
//     })
//   }
//   return (
//     <form className='register' onSubmit={register}>
//         <h1>Register</h1>
//       <input type="text" 
//               placeholder='username'
//               value={username} 
//               onChange={ev => setUsername(ev.target.value)}/>
//       <input type="password" 
//             placeholder='password'
//             value={password}
//             onChange={ev => setPassword(ev.target.value)}/>
//       <button className='registerButton'>Register</button>
//     </form>
//   )
// }

// export default Register