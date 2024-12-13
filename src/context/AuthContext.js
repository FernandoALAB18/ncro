// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(()=>{
    const data = JSON.parse(localStorage.getItem('data')) || {};
    return data.currentUserId || null;
  });

  const login = (userId) => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    data.currentUserId = userId;
    localStorage.setItem('data', JSON.stringify(data));
    setCurrentUserId(userId);
  };

  const logout = () => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    delete data.currentUserId;
    localStorage.setItem('data', JSON.stringify(data));
    setCurrentUserId(null);
  };

  const getCurrentUser = () => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    if(!data.users) return null;
    return data.users.find(u=>u.id===currentUserId) || null;
  };

  return (
    <AuthContext.Provider value={{ currentUserId, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
