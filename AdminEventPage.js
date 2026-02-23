import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './UI';

export default function ProtectedRoute({ children }) {
  const { admin, ready } = useAuth();
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Spinner size={44} /></div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
