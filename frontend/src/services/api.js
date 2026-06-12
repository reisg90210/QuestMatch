import axios from 'axios';

// Use environment variable for API URL in production, fallback to Render backend as default
const API_URL = import.meta.env.VITE_API_URL || 'https://questmatch-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getById: (id) => api.get(`/users/${id}`),
  upgrade: (type) => api.post('/users/upgrade', { type }),
};

export const discovery = {
  getPotentialMatches: () => api.get('/discover'),
};

export const swipes = {
  submitSwipe: (swiped_id, direction) => api.post('/swipes', { swiped_id, direction }),
};

export const matches = {
  list: () => api.get('/matches'),
  getMessages: (matchId) => api.get(`/matches/${matchId}/messages`),
  sendMessage: (matchId, content) => api.post(`/matches/${matchId}/messages`, { content }),
};

export const quests = {
  create: (data) => api.post('/quests', data),
  list: () => api.get('/quests'),
  getById: (id) => api.get(`/quests/${id}`),
  apply: (id) => api.post(`/quests/${id}/apply`),
  getApplications: (id) => api.get(`/quests/${id}/applications`),
};

export const applications = {
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
  remove: (id) => api.delete(`/applications/${id}`),
};

export const notifications = {
  list: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export default api;
