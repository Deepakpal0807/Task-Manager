import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add request interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Remove user from localStorage
      localStorage.removeItem('user');
      
      // Redirect to login page if we're in a browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;