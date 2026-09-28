import axios from 'axios';

const api = axios.create({
  baseURL: '/',            // de Vite-proxy stuurt door naar Laravel
  withCredentials: true,   // cookies meesturen
  withXSRFToken: true,     // XSRF-TOKEN cookie als header meesturen
  headers: { Accept: 'application/json' },
});

export default api;