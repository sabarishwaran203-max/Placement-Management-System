import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCompany } from '../services/api';

const JOB_TYPE_LABELS = {
  FULL_TIME: 'Full Time', INTERNSHIP: 'Internship', INTERNSHIP_FULL_TIME: 'Internship + Full Time',
};

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCompany(id).then((res) => setCompany(res.data)).catch((err) => setError(err.error || 'Company not found.'));
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!company) return <div className="page-loader">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Company Details</h2>
        <div>
          <Link to={`/companies/${id}/edit`} className="btn btn-secondary">Edit</Link>
          <button className="btn btn-outline" onClick={() => navigate('/companies')}>Back</button>
        </div>
      </div>
      <div className="card details-card">
        <div className="details-grid">
          <div><span className="details-label">Company Name</span><p>{company.company_name}</p></div>
          <div><span className="details-label">Industry</span><p>{company.industry}</p></div>
          <div><span className="details-label">Location</span><p>{company.location}</p></div>
          <div><span className="details-label">Job Role</span><p>{company.job_role}</p></div>
          <div><span className="details-label">Minimum CGPA</span><p>{company.minimum_cgpa}</p></div>
          <div><span className="details-label">Package</span><p>₹{Number(company.package).toLocaleString()}</p></div>
          <div><span className="details-label">Job Type</span><p>{JOB_TYPE_LABELS[company.job_type]}</p></div>
          <div><span className="details-label">Drive Date</span><p>{company.drive_date}</p></div>
          <div><span className="details-label">Vacancies</span><p>{company.number_of_vacancies}</p></div>
          <div><span className="details-label">Eligibility</span><p>{company.eligibility || '—'}</p></div>
          <div className="form-field-wide"><span className="details-label">Description</span><p>{company.description || '—'}</p></div>
        </div>
      </div>
    </div>
  );
}
