import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlacements, deletePlacement } from '../services/api';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';

const TYPE_LABELS = { FULL_TIME: 'Full Time', INTERNSHIP: 'Internship', INTERNSHIP_FULL_TIME: 'Internship + Full Time' };

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchPlacements = () => {
    setLoading(true);
    getPlacements()
      .then((res) => setPlacements(res.data))
      .catch((err) => setError(err.error || 'Failed to load placements.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlacements(); }, []);

  const handleDelete = async () => {
    try {
      await deletePlacement(confirmId);
      setNotice({ type: 'success', message: 'Placement record deleted successfully' });
      setConfirmId(null);
      fetchPlacements();
    } catch (err) {
      setNotice({ type: 'error', message: err.error || 'Failed to delete placement.' });
      setConfirmId(null);
    }
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <ConfirmDialog open={!!confirmId} title="Delete Placement Record" message="Delete this placement record?"
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />

      <div className="page-header">
        <h2>Placement Records</h2>
        <Link to="/placements/add" className="btn btn-primary">+ Add Placement</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="page-loader">Loading placements...</div>
        ) : placements.length === 0 ? (
          <p className="empty-state">No placement records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Company</th><th>Job Role</th><th>Package</th><th>Date</th><th>Type</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {placements.map((p) => (
                  <tr key={p.id}>
                    <td>{p.student_name}</td>
                    <td>{p.company_name}</td>
                    <td>{p.job_role}</td>
                    <td>₹{Number(p.package).toLocaleString()}</td>
                    <td>{p.placement_date}</td>
                    <td>{TYPE_LABELS[p.placement_type]}</td>
                    <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                    <td className="actions-cell">
                      <Link to={`/placements/${p.id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
