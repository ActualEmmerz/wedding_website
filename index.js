import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }  from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute    from './components/ProtectedRoute';

import AdminLogin      from './pages/AdminLogin';
import AdminDashboard  from './pages/AdminDashboard';
import AdminEventPage  from './pages/AdminEventPage';
import GuestUpload     from './pages/GuestUpload';
import GalleryPage     from './pages/GalleryPage';
import SlideshowPage   from './pages/SlideshowPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public — guest routes */}
            <Route path="/e/:token"           element={<GuestUpload/>}  />
            <Route path="/e/:token/gallery"   element={<GalleryPage/>}  />
            <Route path="/e/:token/slideshow" element={<SlideshowPage/>}/>

            {/* Admin — protected */}
            <Route path="/admin/login"        element={<AdminLogin/>}   />
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard/></ProtectedRoute>
            }/>
            <Route path="/admin/events/:id" element={
              <ProtectedRoute><AdminEventPage/></ProtectedRoute>
            }/>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/admin" replace/>}/>
            <Route path="*" element={<Navigate to="/admin" replace/>}/>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
