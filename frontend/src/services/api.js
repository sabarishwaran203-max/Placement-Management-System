import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pms_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('pms_token');
        localStorage.removeItem('pms_username');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error.response.data || { error: 'Something went wrong.' });
    } else if (error.request) {
      return Promise.reject({ error: 'Backend server is unavailable. Please check if Django is running.' });
    }
    return Promise.reject({ error: 'Network error. Please check your connection.' });
  }
);

// ---------------- Auth ----------------
export const login = (username, password) => api.post('/auth/login/', { username, password });
export const logout = () => api.post('/auth/logout/');

// ---------------- Dashboard / Reports ----------------
export const getDashboardStats = () => api.get('/dashboard/stats/');
export const getReports = () => api.get('/reports/');

// ---------------- Students ----------------
export const getStudents = (params) => api.get('/students/', { params });
export const getStudent = (id) => api.get(`/students/${id}/`);
export const createStudent = (data) => api.post('/students/', data);
export const updateStudent = (id, data) => api.patch(`/students/${id}/`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}/`);

// ---------------- Companies ----------------
export const getCompanies = (params) => api.get('/companies/', { params });
export const getCompany = (id) => api.get(`/companies/${id}/`);
export const createCompany = (data) => api.post('/companies/', data);
export const updateCompany = (id, data) => api.patch(`/companies/${id}/`, data);
export const deleteCompany = (id) => api.delete(`/companies/${id}/`);

// ---------------- Applications ----------------
export const getApplications = (params) => api.get('/applications/', { params });
export const getApplication = (id) => api.get(`/applications/${id}/`);
export const createApplication = (data) => api.post('/applications/', data);
export const updateApplication = (id, data) => api.patch(`/applications/${id}/`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}/`);

// ---------------- Placements ----------------
export const getPlacements = (params) => api.get('/placements/', { params });
export const getPlacement = (id) => api.get(`/placements/${id}/`);
export const createPlacement = (data) => api.post('/placements/', data);
export const updatePlacement = (id, data) => api.patch(`/placements/${id}/`, data);
export const deletePlacement = (id) => api.delete(`/placements/${id}/`);

export default api;
