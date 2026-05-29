import axios from 'axios';

// Use environment variable for API URL in production, fallback to /api for dev proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

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

export default api;
