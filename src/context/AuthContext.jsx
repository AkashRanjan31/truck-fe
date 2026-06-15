import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth from localStorage on mount
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        setAuth(JSON.parse(savedAuth));
      } catch (err) {
        console.error('Error loading auth:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const authData = { ...userData, token };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  const updateAuth = (userData) => {
    const updated = { ...auth, ...userData };
    setAuth(updated);
    localStorage.setItem('auth', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
