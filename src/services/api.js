import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const puppyAPI = {
  getAll:        (p)    => api.get('/puppies', { params: p }),
  getById:       (id)   => api.get(`/puppies/${id}`),
  getBreeds:     ()     => api.get('/puppies/breeds'),
};

export const reservationAPI = {
  create:  (d) => api.post('/reservations', d),
  track:   (num) => api.get(`/reservations/track/${num}`),
};

export const adminAPI = {
  login:           (code) => api.post('/admin/login', { code }),
  stats:           ()     => api.get('/admin/stats'),
  puppies:         ()     => api.get('/admin/puppies'),
  getPuppyById:    (id)   => api.get(`/admin/puppies/${id}`),
  createPuppy:     (fd)   => api.post('/admin/puppies', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }),
  updatePuppy:     (id,fd) => api.put(`/admin/puppies/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }),
  togglePuppy:     (id)   => api.patch(`/admin/puppies/${id}/toggle`),
  deletePuppy:     (id)   => api.delete(`/admin/puppies/${id}`),
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
