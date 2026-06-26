import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('prq_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const parrotAPI = {
  getAll:        (p)    => api.get('/parrots', { params: p }),
  getById:       (id)   => api.get(`/parrots/${id}`),
  getSpecies:    ()     => api.get('/parrots/species'),
};

export const reservationAPI = {
  create:  (d) => api.post('/reservations', d),
  track:   (num) => api.get(`/reservations/track/${num}`),
};

export const adminAPI = {
  login:           (code) => api.post('/admin/login', { code }),
  stats:           ()     => api.get('/admin/stats'),
  parrots:         ()     => api.get('/admin/parrots'),
  getParrotById:   (id)   => api.get(`/admin/parrots/${id}`),
  createParrot:    (fd)   => api.post('/admin/parrots', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }),
  updateParrot:    (id,fd) => api.put(`/admin/parrots/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }),
  toggleParrot:    (id)   => api.patch(`/admin/parrots/${id}/toggle`),
  deleteParrot:    (id)   => api.delete(`/admin/parrots/${id}`),
  reservations:    (p)    => api.get('/admin/reservations', { params: p }),
  reservationById: (id)   => api.get(`/admin/reservations/${id}`),
  updateReservation:(id,d) => api.patch(`/admin/reservations/${id}`, d),
  deleteReservation:(id)  => api.delete(`/admin/reservations/${id}`),
  replyToCustomer:(id,m)  => api.post(`/admin/reservations/${id}/reply`, m),
  clients:         ()     => api.get('/admin/clients'),
  waitlist:        ()     => api.get('/admin/waitlist'),
};

export const waitlistAPI = {
  join: (d) => api.post('/waitlist', d),
};

export default api;
