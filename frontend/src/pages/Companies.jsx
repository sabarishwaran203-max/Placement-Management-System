import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies, deleteCompany } from '../services/api';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchCompanies = () => {
    setLoading(true);
    getCompanies(search ? { search } : {})
      .then((res) => setCompanies(res.data))
      .catch((err) => setError(err.error || 'Failed to load companies.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCompanies(); /* eslint-disable-next-line */ }, [search]);

  const handleDelete = async () => {
    try {
      await deleteCompany(confirmId);
      setNotice({ type: 'success', message: 'Company deleted successfully' });
      setConfirmId(null);
      fetchCompanies();
    } catch (err) {
      setNotice({ type: 'error', message: err.error || 'Failed to delete company.' });
      setConfirmId(null);
    }
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <ConfirmDialog
        open={!!confirmId} title="Delete Company"
        message="Are you sure you want to delete this company? This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)}
      />

      <div className="page-header">
        <h2>Companies</h2>
        <Link to="/companies/add" className="btn btn-primary">+ Add Company</Link>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="Search by name, industry, location, job role..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="page-loader">Loading companies...</div>
        ) : companies.length === 0 ? (
          <p className="empty-state">No companies found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Industry</th><th>Location</th><th>Job Role</th><th>Package</th><th>Drive Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td>{c.company_name}</td>
                    <td>{c.industry}</td>
                    <td>{c.location}</td>
                    <td>{c.job_role}</td>
                    <td>₹{Number(c.package).toLocaleString()}</td>
                    <td>{c.drive_date}</td>
                    <td className="actions-cell">
                      <Link to={`/companies/${c.id}`} className="btn btn-sm btn-outline">View</Link>
                      <Link to={`/companies/${c.id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(c.id)}>Delete</button>
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
