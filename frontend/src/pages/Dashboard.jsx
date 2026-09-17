import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';

const statCards = [
  { key: 'total_students', label: 'Total Students', icon: '🎓', color: 'blue' },
  { key: 'total_companies', label: 'Total Companies', icon: '🏢', color: 'purple' },
  { key: 'total_applications', label: 'Total Applications', icon: '📄', color: 'orange' },
  { key: 'students_placed', label: 'Students Placed', icon: '✅', color: 'green' },
  { key: 'students_not_placed', label: 'Students Not Placed', icon: '⏳', color: 'red' },
  { key: 'placement_percentage', label: 'Placement %', icon: '📈', color: 'teal', suffix: '%' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.error || 'Failed to load dashboard statistics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader">Loading dashboard...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Overview of placement activity across the college</p>
      </div>

      <div className="stats-grid">
        {statCards.map((c) => (
          <div className={`stat-card stat-${c.color}`} key={c.key}>
            <div className="stat-icon">{c.icon}</div>
            <div>
              <div className="stat-value">{stats[c.key]}{c.suffix || ''}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Placement Activity</h3>
          <Link to="/placements" className="link">View all →</Link>
        </div>
        {stats.recent_activity.length === 0 ? (
          <p className="empty-state">No placements recorded yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Package</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_activity.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.student_name}</td>
                  <td>{r.company_name}</td>
                  <td>₹{Number(r.package).toLocaleString()}</td>
                  <td>{r.placement_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
