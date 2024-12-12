import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { token, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
    } catch(err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div style={{padding:'20px'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
