import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../services/api';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_LABELS = {
  NOT_PLACED: 'Not Placed', APPLIED: 'Applied', SHORTLISTED: 'Shortlisted', SELECTED: 'Selected',
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');

  const fetchStudents = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (department) params.department = department;
    if (year) params.year = year;
    if (status) params.placement_status = status;
    getStudents(params)
      .then((res) => setStudents(res.data))
      .catch((err) => setError(err.error || 'Failed to load students.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); /* eslint-disable-next-line */ }, [search, department, year, status]);

  const handleDelete = async () => {
    try {
      await deleteStudent(confirmId);
      setNotice({ type: 'success', message: 'Student deleted successfully' });
      setConfirmId(null);
      fetchStudents();
    } catch (err) {
      setNotice({ type: 'error', message: err.error || 'Failed to delete student.' });
      setConfirmId(null);
    }
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <ConfirmDialog
        open={!!confirmId}
        title="Delete Student"
        message="Are you sure you want to delete this student record? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      <div className="page-header">
        <h2>Students</h2>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search by name, register no, department, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="page-loader">Loading students...</div>
        ) : students.length === 0 ? (
          <p className="empty-state">No students found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reg No</th><th>Name</th><th>Department</th><th>Year</th>
                  <th>CGPA</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.register_number}</td>
                    <td>{s.full_name}</td>
                    <td>{s.department}</td>
                    <td>{s.year}</td>
                    <td>{s.cgpa}</td>
                    <td><span className={`badge badge-${s.placement_status.toLowerCase()}`}>{STATUS_LABELS[s.placement_status]}</span></td>
                    <td className="actions-cell">
                      <Link to={`/students/${s.id}`} className="btn btn-sm btn-outline">View</Link>
                      <Link to={`/students/${s.id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmId(s.id)}>Delete</button>
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
