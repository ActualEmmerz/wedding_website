import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL: `${BASE}/api`, withCredentials: true });

api.interceptors.request.use((cfg) => {
  const tok = localStorage.getItem('mm_token');
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mm_token');
      if (window.location.pathname.startsWith('/admin'))
        window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
