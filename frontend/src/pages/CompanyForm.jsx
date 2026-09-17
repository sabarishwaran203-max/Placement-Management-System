import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCompany, getCompany, updateCompany } from '../services/api';
import Notification from '../components/Notification';

const emptyForm = {
  company_name: '', industry: '', location: '', job_role: '', minimum_cgpa: '',
  package: '', job_type: 'FULL_TIME', drive_date: '', number_of_vacancies: '',
  eligibility: '', description: '',
};

function validate(form) {
  const errors = {};
  if (!form.company_name.trim()) errors.company_name = 'Company name is required.';
  if (!form.job_role.trim()) errors.job_role = 'Job role is required.';
  if (form.minimum_cgpa === '' || Number(form.minimum_cgpa) < 0 || Number(form.minimum_cgpa) > 10) errors.minimum_cgpa = 'Minimum CGPA must be between 0 and 10.';
  if (form.package === '' || Number(form.package) < 0) errors.package = 'Package must not be negative.';
  if (!form.drive_date) errors.drive_date = 'Drive date must be valid.';
  if (form.number_of_vacancies === '' || Number(form.number_of_vacancies) <= 0) errors.number_of_vacancies = 'Number of vacancies must be positive.';
  return errors;
}

export default function CompanyForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getCompany(id).then((res) => setForm({
        ...res.data, minimum_cgpa: String(res.data.minimum_cgpa), package: String(res.data.package),
      }));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const flattenErrors = (details) => {
    const out = {};
    Object.entries(details).forEach(([k, v]) => { out[k] = Array.isArray(v) ? v[0] : v; });
    return out;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;
    setSaving(true);
    try {
      if (isEdit) {
        await updateCompany(id, form);
        setNotice({ type: 'success', message: 'Company updated successfully' });
      } else {
        await createCompany(form);
        setNotice({ type: 'success', message: 'Company created successfully' });
      }
      setTimeout(() => navigate('/companies'), 700);
    } catch (err) {
      if (err.details) setErrors((prev) => ({ ...prev, ...flattenErrors(err.details) }));
      setNotice({ type: 'error', message: err.error || 'Failed to save company.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <div className="page-header"><h2>{isEdit ? 'Edit Company' : 'Add Company'}</h2></div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Company Name *</label>
            <input name="company_name" value={form.company_name} onChange={handleChange} />
            {errors.company_name && <span className="field-error">{errors.company_name}</span>}
          </div>
          <div className="form-field">
            <label>Industry</label>
            <input name="industry" value={form.industry} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Job Role *</label>
            <input name="job_role" value={form.job_role} onChange={handleChange} />
            {errors.job_role && <span className="field-error">{errors.job_role}</span>}
          </div>
          <div className="form-field">
            <label>Minimum CGPA *</label>
            <input name="minimum_cgpa" type="number" step="0.01" min="0" max="10" value={form.minimum_cgpa} onChange={handleChange} />
            {errors.minimum_cgpa && <span className="field-error">{errors.minimum_cgpa}</span>}
          </div>
          <div className="form-field">
            <label>Package (₹) *</label>
            <input name="package" type="number" step="0.01" min="0" value={form.package} onChange={handleChange} />
            {errors.package && <span className="field-error">{errors.package}</span>}
          </div>
          <div className="form-field">
            <label>Job Type</label>
            <select name="job_type" value={form.job_type} onChange={handleChange}>
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="INTERNSHIP_FULL_TIME">Internship + Full Time</option>
            </select>
          </div>
          <div className="form-field">
            <label>Drive Date *</label>
            <input name="drive_date" type="date" value={form.drive_date} onChange={handleChange} />
            {errors.drive_date && <span className="field-error">{errors.drive_date}</span>}
          </div>
          <div className="form-field">
            <label>Number of Vacancies *</label>
            <input name="number_of_vacancies" type="number" min="1" value={form.number_of_vacancies} onChange={handleChange} />
            {errors.number_of_vacancies && <span className="field-error">{errors.number_of_vacancies}</span>}
          </div>
          <div className="form-field form-field-wide">
            <label>Eligibility</label>
            <input name="eligibility" value={form.eligibility} onChange={handleChange} />
          </div>
          <div className="form-field form-field-wide">
            <label>Description</label>
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/companies')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Company'}</button>
        </div>
      </form>
    </div>
  );
}
