import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import StudentDetails from './pages/StudentDetails';
import Companies from './pages/Companies';
import CompanyForm from './pages/CompanyForm';
import CompanyDetails from './pages/CompanyDetails';
import Applications from './pages/Applications';
import ApplicationForm from './pages/ApplicationForm';
import Placements from './pages/Placements';
import PlacementForm from './pages/PlacementForm';
import Reports from './pages/Reports';
import About from './pages/About';

function isAuthenticated() {
  return !!localStorage.getItem('pms_token');
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} />
      <div className="app-main">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><Layout><Students /></Layout></ProtectedRoute>} />
      <Route path="/students/add" element={<ProtectedRoute><Layout><StudentForm /></Layout></ProtectedRoute>} />
      <Route path="/students/:id/edit" element={<ProtectedRoute><Layout><StudentForm /></Layout></ProtectedRoute>} />
      <Route path="/students/:id" element={<ProtectedRoute><Layout><StudentDetails /></Layout></ProtectedRoute>} />

      <Route path="/companies" element={<ProtectedRoute><Layout><Companies /></Layout></ProtectedRoute>} />
      <Route path="/companies/add" element={<ProtectedRoute><Layout><CompanyForm /></Layout></ProtectedRoute>} />
      <Route path="/companies/:id/edit" element={<ProtectedRoute><Layout><CompanyForm /></Layout></ProtectedRoute>} />
      <Route path="/companies/:id" element={<ProtectedRoute><Layout><CompanyDetails /></Layout></ProtectedRoute>} />

      <Route path="/applications" element={<ProtectedRoute><Layout><Applications /></Layout></ProtectedRoute>} />
      <Route path="/applications/add" element={<ProtectedRoute><Layout><ApplicationForm /></Layout></ProtectedRoute>} />
      <Route path="/applications/:id/edit" element={<ProtectedRoute><Layout><ApplicationForm /></Layout></ProtectedRoute>} />

      <Route path="/placements" element={<ProtectedRoute><Layout><Placements /></Layout></ProtectedRoute>} />
      <Route path="/placements/add" element={<ProtectedRoute><Layout><PlacementForm /></Layout></ProtectedRoute>} />
      <Route path="/placements/:id/edit" element={<ProtectedRoute><Layout><PlacementForm /></Layout></ProtectedRoute>} />

      <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><Layout><About /></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
