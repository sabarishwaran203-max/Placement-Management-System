import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/companies', label: 'Companies', icon: '🏢' },
  { to: '/applications', label: 'Applications', icon: '📄' },
  { to: '/placements', label: 'Placements', icon: '✅' },
  { to: '/reports', label: 'Reports', icon: '📈' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
];

export default function Sidebar({ open }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-icon">🎯</span>
        <span className="brand-text">Placement Cell</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
