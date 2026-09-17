import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export default function Header({ onToggleSidebar }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('pms_username') || 'Admin';

  const handleLogout = async () => {
    try { await logout(); } catch (e) { /* ignore */ }
    localStorage.removeItem('pms_token');
    localStorage.removeItem('pms_username');
    navigate('/login');
  };

  return (
    <header className="header">
      <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle navigation">☰</button>
      <h1 className="header-title">College Placement Management System</h1>
      <div className="header-user">
        <span className="user-badge">👤 {username}</span>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
