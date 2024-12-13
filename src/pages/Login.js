// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { currentUserId, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(currentUserId) {
      navigate('/dashboard');
    }
  }, [currentUserId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('data')) || {};
    if(!data.users) data.users = [];
    const user = data.users.find(u=>u.email===email && u.password===password);
    if(!user) {
      alert('Login failed, incorrect email or password.');
      return;
    }

    login(user.id);
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
