import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData, token) => api.post('/events', eventData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, eventData, token) => api.put(`/events/${id}`, eventData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getOrganizerEvents: (token) => api.get('/events/organizer', {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// Registration API
export const registrationAPI = {
  register: (eventId, token) => api.post(`/registrations/events/${eventId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  unregister: (eventId, token) => api.delete(`/registrations/events/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAttendees: (eventId) => api.get(`/registrations/events/${eventId}/attendees`),
  getUserEvents: (token) => api.get('/registrations/my-events', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getOrganizerAttendees: (token) => api.get('/registrations/organizer-attendees', {
    headers: { Authorization: `Bearer ${token}` }
  })
};