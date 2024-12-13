// frontend/src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { currentUserId, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/mi-logo.png" alt="Logo" className="logo"/>
        <div className="navbar-menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/deposit">Deposit</Link>
          <Link to="/withdraw">Withdraw</Link>
          <Link to="/card">Card</Link>
          <Link to="/history">History</Link>
          <Link to="/manage-wallets">Manage Wallets</Link>
        </div>
      </div>

      {/* Si el usuario está logueado (currentUserId existe), mostramos logout.
         Si no, mostramos Register y Login */}
      {currentUserId ? (
        <button className="main-wallet-btn" onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <button className="main-wallet-btn" onClick={()=>window.location.href='/register'}>Register</button>
          <button className="main-wallet-btn" onClick={()=>window.location.href='/'} style={{marginLeft:'10px'}}>Login</button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
