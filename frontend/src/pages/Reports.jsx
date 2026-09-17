import React, { useEffect, useState } from 'react';
import { getReports } from '../services/api';

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getReports().then((res) => setData(res.data)).catch((err) => setError(err.error || 'Failed to load reports.'));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!data) return <div className="page-loader">Loading reports...</div>;

  return (
    <div>
      <div className="page-header"><h2>Reports & Statistics</h2></div>

      <div className="stats-grid">
        <div className="stat-card stat-green">
          <div className="stat-icon">✅</div>
          <div><div className="stat-value">{data.total_placed_students}</div><div className="stat-label">Total Placed</div></div>
        </div>
        <div className="stat-card stat-blue">
          <div className="stat-icon">💰</div>
          <div><div className="stat-value">₹{Number(data.average_package).toLocaleString()}</div><div className="stat-label">Average Package</div></div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">🏆</div>
          <div><div className="stat-value">₹{Number(data.highest_package).toLocaleString()}</div><div className="stat-label">Highest Package</div></div>
        </div>
      </div>

      <div className="card">
        <h3>Department-wise Placement Statistics</h3>
        <table className="data-table">
          <thead><tr><th>Department</th><th>Total Students</th><th>Placed</th></tr></thead>
          <tbody>
            {data.department_wise.map((d, i) => (
              <tr key={i}><td>{d.department}</td><td>{d.total}</td><td>{d.placed}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Placement Status Breakdown</h3>
        <table className="data-table">
          <thead><tr><th>Status</th><th>Count</th></tr></thead>
          <tbody>
            {data.status_wise.map((s, i) => (
              <tr key={i}><td>{s.placement_status}</td><td>{s.total}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Company-wise Placements</h3>
        {data.company_wise.length === 0 ? <p className="empty-state">No placement records yet.</p> : (
          <table className="data-table">
            <thead><tr><th>Company</th><th>Students Placed</th><th>Average Package</th></tr></thead>
            <tbody>
              {data.company_wise.map((c, i) => (
                <tr key={i}>
                  <td>{c.company__company_name}</td>
                  <td>{c.total_placed}</td>
                  <td>₹{Number(c.avg_package).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
