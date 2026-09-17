import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, deleteApplication, getCompanies, getStudents } from '../services/api';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_LABELS = {
  APPLIED: 'Applied', SHORTLISTED: 'Shortlisted', INTERVIEW_SCHEDULED: 'Interview Scheduled',
  SELECTED: 'Selected', REJECTED: 'Rejected',
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const [companyFilter, setCompanyFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getCompanies().then((res) => setCompanies(res.data)).catch(() => {});
    getStudents().then((res) => setStudents(res.data)).catch(() => {});
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    const params = {};
    if (companyFilter) params.company = companyFilter;
    if (studentFilter) params.student = studentFilter;
    if (statusFilter) params.application_status = statusFilter;
    getApplications(params)
      .then((res) => setApplications(res.data))
      .catch((err) => setError(err.error || 'Failed to load applications.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplications(); /* eslint-disable-next-line */ }, [companyFilter, studentFilter, statusFilter]);

  const handleDelete = async () => {
    try {
      await deleteApplication(confirmId);
      setNotice({ type: 'success', message: 'Application deleted successfully' });
      setConfirmId(null);
      fetchApplications();
    } catch (err) {
      setNotice({ type: 'error', message: err.error || 'Failed to delete application.' });
      setConfirmId(null);
    }
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <ConfirmDialog open={!!confirmId} title="Delete Application" message="Delete this application record?"
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />

      <div className="page-header">
        <h2>Placement Applications</h2>
        <Link to="/applications/add" className="btn btn-primary">+ Add Application</Link>
      </div>

      <div className="filter-bar">
        <select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
          <option value="">All Students</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
        </select>
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
          <option value="">All Companies</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="page-loader">Loading applications...</div>
        ) : applications.length === 0 ? (
          <p className="empty-state">No applications found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Company</th><th>Job Role</th><th>Applied On</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id}>
                    <td>{a.student_name}</td>
                    <td>{a.company_name}</td>
                    <td>{a.job_role}</td>
                    <td>{a.application_date}</td>
                    <td><span className={`badge badge-${a.application_status.toLowerCase()}`}>{STATUS_LABELS[a.application_status]}</span></td>
                    <td className="actions-cell">
                      <Link to={`/applications/${a.id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(a.id)}>Delete</button>
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
