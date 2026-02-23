import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const Ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]   = useState(null);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem('mm_token');
    if (!tok) { setReady(true); return; }
    api.get('/auth/me')
      .then(r => setAdmin(r.data))
      .catch(() => localStorage.removeItem('mm_token'))
      .finally(() => setReady(true));
  }, []);

  const login = async (email, pw) => {
    const r = await api.post('/auth/login', { email, password: pw });
    localStorage.setItem('mm_token', r.data.token);
    setAdmin(r.data.admin);
  };

  const register = async (email, pw, name) => {
    const r = await api.post('/auth/register', { email, password: pw, name });
    localStorage.setItem('mm_token', r.data.token);
    setAdmin(r.data.admin);
  };

  const logout = () => {
    localStorage.removeItem('mm_token');
    setAdmin(null);
  };

  return (
    <Ctx.Provider value={{ admin, ready, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
