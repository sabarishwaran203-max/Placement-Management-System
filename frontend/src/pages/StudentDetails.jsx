import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStudent } from '../services/api';

const STATUS_LABELS = {
  NOT_PLACED: 'Not Placed', APPLIED: 'Applied', SHORTLISTED: 'Shortlisted', SELECTED: 'Selected',
};

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudent(id)
      .then((res) => setStudent(res.data))
      .catch((err) => setError(err.error || 'Student not found.'));
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!student) return <div className="page-loader">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Student Details</h2>
        <div>
          <Link to={`/students/${id}/edit`} className="btn btn-secondary">Edit</Link>
          <button className="btn btn-outline" onClick={() => navigate('/students')}>Back</button>
        </div>
      </div>

      <div className="card details-card">
        <div className="details-grid">
          <div><span className="details-label">Register Number</span><p>{student.register_number}</p></div>
          <div><span className="details-label">Full Name</span><p>{student.full_name}</p></div>
          <div><span className="details-label">Email</span><p>{student.email}</p></div>
          <div><span className="details-label">Phone</span><p>{student.phone_number}</p></div>
          <div><span className="details-label">Department</span><p>{student.department}</p></div>
          <div><span className="details-label">Year</span><p>{student.year}</p></div>
          <div><span className="details-label">CGPA</span><p>{student.cgpa}</p></div>
          <div><span className="details-label">Graduation Year</span><p>{student.graduation_year}</p></div>
          <div><span className="details-label">Placement Status</span>
            <p><span className={`badge badge-${student.placement_status.toLowerCase()}`}>{STATUS_LABELS[student.placement_status]}</span></p>
          </div>
          <div><span className="details-label">Company</span><p>{student.company_name || '—'}</p></div>
          <div><span className="details-label">Package</span><p>₹{Number(student.package).toLocaleString()}</p></div>
          <div><span className="details-label">Skills</span><p>{student.skills || '—'}</p></div>
          <div><span className="details-label">Created</span><p>{new Date(student.created_date).toLocaleString()}</p></div>
        </div>
      </div>
    </div>
  );
}
