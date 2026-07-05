import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API
export const getProjects = (params) => api.get('/projects', { params });
export const getFeaturedProjects = () => api.get('/projects/featured');
export const getProject = (slug) => api.get(`/projects/${slug}`);
export const getTestimonials = () => api.get('/testimonials');
export const submitContact = (data) => api.post('/contacts', data);
export const getCategories = () => api.get('/categories');

// Admin API
export const adminLogin = (data) => api.post('/auth/login', data);
export const adminSetup = (data) => api.post('/auth/setup', data);
export const getMe = () => api.get('/auth/me');
export const getStats = () => api.get('/stats');

export const getAdminProjects = (params) => api.get('/projects/admin/all', { params });
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getAdminTestimonials = () => api.get('/testimonials/admin/all');
export const createTestimonial = (data) => api.post('/testimonials', data);
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

export const getContacts = (params) => api.get('/contacts', { params });
export const markContactRead = (id) => api.patch(`/contacts/${id}/read`);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
export const exportContactsCSV = () => api.get('/contacts/export/csv', { responseType: 'blob' });

export const uploadImage = (formData) => api.post('/upload/single', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 60000,
});
export const uploadMultipleImages = (formData) => api.post('/upload/multiple', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 120000,
});
export const deleteImage = (publicId) => api.delete('/upload', { params: { publicId } });

export default api;
