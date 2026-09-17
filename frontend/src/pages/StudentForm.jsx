import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudent, updateStudent } from '../services/api';
import Notification from '../components/Notification';

const emptyForm = {
  register_number: '', full_name: '', email: '', phone_number: '',
  department: '', year: '1', cgpa: '', skills: '', graduation_year: '',
  placement_status: 'NOT_PLACED', company_name: '', package: '0',
};

function validate(form) {
  const errors = {};
  if (!form.register_number.trim()) errors.register_number = 'Register number cannot be empty.';
  if (!form.full_name.trim()) errors.full_name = 'Name cannot be empty.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email address is invalid.';
  if (!form.phone_number.trim()) errors.phone_number = 'Phone number is required.';
  else if (!/^\+?\d{10,15}$/.test(form.phone_number.trim())) errors.phone_number = 'Phone number must contain 10-15 valid digits.';
  if (!form.department.trim()) errors.department = 'Department is required.';
  if (!form.year) errors.year = 'Year is required.';
  if (form.cgpa === '' || Number(form.cgpa) < 0 || Number(form.cgpa) > 10) errors.cgpa = 'CGPA must be between 0 and 10.';
  if (!form.graduation_year) errors.graduation_year = 'Graduation year is required.';
  if (form.package !== '' && Number(form.package) < 0) errors.package = 'Package cannot be negative.';
  return errors;
}

export default function StudentForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getStudent(id).then((res) => setForm({ ...res.data, cgpa: String(res.data.cgpa), package: String(res.data.package) }));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSaving(true);
    try {
      if (isEdit) {
        await updateStudent(id, form);
        setNotice({ type: 'success', message: 'Student updated successfully' });
      } else {
        await createStudent(form);
        setNotice({ type: 'success', message: 'Student created successfully' });
      }
      setTimeout(() => navigate('/students'), 700);
    } catch (err) {
      if (err.details) setErrors((prev) => ({ ...prev, ...flattenErrors(err.details) }));
      setNotice({ type: 'error', message: err.error || 'Failed to save student.' });
    } finally {
      setSaving(false);
    }
  };

  const flattenErrors = (details) => {
    const out = {};
    Object.entries(details).forEach(([k, v]) => { out[k] = Array.isArray(v) ? v[0] : v; });
    return out;
  };

  return (
    <div>
      <Notification message={notice?.message} type={notice?.type} onClose={() => setNotice(null)} />
      <div className="page-header"><h2>{isEdit ? 'Edit Student' : 'Add Student'}</h2></div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Register Number *</label>
            <input name="register_number" value={form.register_number} onChange={handleChange} />
            {errors.register_number && <span className="field-error">{errors.register_number}</span>}
          </div>
          <div className="form-field">
            <label>Full Name *</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} />
            {errors.full_name && <span className="field-error">{errors.full_name}</span>}
          </div>
          <div className="form-field">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-field">
            <label>Phone Number *</label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange} />
            {errors.phone_number && <span className="field-error">{errors.phone_number}</span>}
          </div>
          <div className="form-field">
            <label>Department *</label>
            <input name="department" value={form.department} onChange={handleChange} />
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>
          <div className="form-field">
            <label>Year *</label>
            <select name="year" value={form.year} onChange={handleChange}>
              <option value="1">1st Year</option><option value="2">2nd Year</option>
              <option value="3">3rd Year</option><option value="4">4th Year</option>
            </select>
          </div>
          <div className="form-field">
            <label>CGPA *</label>
            <input name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={handleChange} />
            {errors.cgpa && <span className="field-error">{errors.cgpa}</span>}
          </div>
          <div className="form-field">
            <label>Graduation Year *</label>
            <input name="graduation_year" type="number" value={form.graduation_year} onChange={handleChange} />
            {errors.graduation_year && <span className="field-error">{errors.graduation_year}</span>}
          </div>
          <div className="form-field">
            <label>Placement Status</label>
            <select name="placement_status" value={form.placement_status} onChange={handleChange}>
              <option value="NOT_PLACED">Not Placed</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="SELECTED">Selected</option>
            </select>
          </div>
          <div className="form-field">
            <label>Company Name</label>
            <input name="company_name" value={form.company_name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Package (₹)</label>
            <input name="package" type="number" step="0.01" min="0" value={form.package} onChange={handleChange} />
            {errors.package && <span className="field-error">{errors.package}</span>}
          </div>
          <div className="form-field form-field-wide">
            <label>Skills</label>
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Python, React, SQL" />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Student'}</button>
        </div>
      </form>
    </div>
  );
}
