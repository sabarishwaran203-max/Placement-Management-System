import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPlacement, getPlacement, updatePlacement, getStudents, getCompanies } from '../services/api';
import Notification from '../components/Notification';

const emptyForm = {
  student: '', company: '', job_role: '', package: '', placement_date: '',
  placement_type: 'FULL_TIME', status: 'CONFIRMED',
};

function validate(form) {
  const errors = {};
  if (!form.student) errors.student = 'Student is required.';
  if (!form.company) errors.company = 'Company is required.';
  if (!form.placement_date) errors.placement_date = 'Placement date is required.';
  if (form.package === '' || Number(form.package) < 0) errors.package = 'Package cannot be negative.';
  return errors;
}

export default function PlacementForm() {
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
      getPlacement(id).then((res) => setForm({ ...res.data, package: String(res.data.package) }));
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
        await updatePlacement(id, form);
        setNotice({ type: 'success', message: 'Placement updated successfully' });
      } else {
        await createPlacement(form);
        setNotice({ type: 'success', message: 'Placement created successfully' });
      }
      setTimeout(() => navigate('/placements'), 700);
    } catch (err) {
      if (err.details) setErrors((prev) => ({ ...prev, ...flattenErrors(err.details) }));
      setNotice({ type: 'error', message: err.error || 'Failed to save placement.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <div className="page-header"><h2>{isEdit ? 'Edit Placement' : 'Add Placement'}</h2></div>

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
            <label>Package (₹) *</label>
            <input name="package" type="number" step="0.01" min="0" value={form.package} onChange={handleChange} />
            {errors.package && <span className="field-error">{errors.package}</span>}
          </div>
          <div className="form-field">
            <label>Placement Date *</label>
            <input name="placement_date" type="date" value={form.placement_date} onChange={handleChange} />
            {errors.placement_date && <span className="field-error">{errors.placement_date}</span>}
          </div>
          <div className="form-field">
            <label>Placement Type</label>
            <select name="placement_type" value={form.placement_type} onChange={handleChange}>
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="INTERNSHIP_FULL_TIME">Internship + Full Time</option>
            </select>
          </div>
          <div className="form-field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/placements')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Placement'}</button>
        </div>
      </form>
    </div>
  );
}
