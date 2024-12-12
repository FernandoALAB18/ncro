import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      alert('Registered successfully');
      navigate('/');
    } catch(err) {
      console.error(err);
      alert('Register failed');
    }
  };

  return (
    <div style={{padding:'20px'}}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;
