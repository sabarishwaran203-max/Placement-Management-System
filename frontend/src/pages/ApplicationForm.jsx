import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createApplication, getApplication, updateApplication, getStudents, getCompanies } from '../services/api';
import Notification from '../components/Notification';

const emptyForm = {
  student: '', company: '', application_date: '', job_role: '',
  application_status: 'APPLIED', interview_date: '', result: '',
};

function validate(form) {
  const errors = {};
  if (!form.student) errors.student = 'Student is required.';
  if (!form.company) errors.company = 'Company is required.';
  if (!form.application_date) errors.application_date = 'Application date is required.';
  if (!form.application_status) errors.application_status = 'Status is required.';
  return errors;
}

export default function ApplicationForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data)).catch(() => {});
    getCompanies().then((res) => setCompanies(res.data)).catch(() => {});
    if (isEdit) {
      getApplication(id).then((res) => setForm({
        ...res.data,
        interview_date: res.data.interview_date || '',
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
    const payload = { ...form, interview_date: form.interview_date || null };
    try {
      if (isEdit) {
        await updateApplication(id, payload);
        setNotice({ type: 'success', message: 'Application updated successfully' });
      } else {
        await createApplication(payload);
        setNotice({ type: 'success', message: 'Application created successfully' });
      }
      setTimeout(() => navigate('/applications'), 700);
    } catch (err) {
      if (err.details) setErrors((prev) => ({ ...prev, ...flattenErrors(err.details) }));
      setNotice({ type: 'error', message: err.error || 'Failed to save application.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <div className="page-header"><h2>{isEdit ? 'Edit Application' : 'Add Application'}</h2></div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Student *</label>
            <select name="student" value={form.student} onChange={handleChange}>
              <option value="">-- Select Student --</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.full_name} ({s.register_number})</option>)}
            </select>
            {errors.student && <span className="field-error">{errors.student}</span>}
          </div>
          <div className="form-field">
            <label>Company *</label>
            <select name="company" value={form.company} onChange={handleChange}>
              <option value="">-- Select Company --</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
            {errors.company && <span className="field-error">{errors.company}</span>}
          </div>
          <div className="form-field">
            <label>Job Role</label>
            <input name="job_role" value={form.job_role} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Application Date *</label>
            <input name="application_date" type="date" value={form.application_date} onChange={handleChange} />
            {errors.application_date && <span className="field-error">{errors.application_date}</span>}
          </div>
          <div className="form-field">
            <label>Status *</label>
            <select name="application_status" value={form.application_status} onChange={handleChange}>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="form-field">
            <label>Interview Date</label>
            <input name="interview_date" type="date" value={form.interview_date} onChange={handleChange} />
          </div>
          <div className="form-field form-field-wide">
            <label>Result / Remarks</label>
            <input name="result" value={form.result} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/applications')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Application'}</button>
        </div>
      </form>
    </div>
  );
}
