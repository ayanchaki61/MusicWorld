import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Music API calls
export const musicService = {
  // Get all music with optional filters
  getAllMusic: async (params = {}) => {
    try {
      const response = await api.get('/music', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single music by ID
  getMusicById: async (id) => {
    try {
      const response = await api.get(`/music/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all genres
  getGenres: async () => {
    try {
      const response = await api.get('/music/genres');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all languages
  getLanguages: async () => {
    try {
      const response = await api.get('/music/languages');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all artists
  getArtists: async () => {
    try {
      const response = await api.get('/music/artists');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upvote a music track
  upvoteMusic: async (id) => {
    try {
      const response = await api.post(`/music/${id}/upvote`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Downvote a music track
  downvoteMusic: async (id) => {
    try {
      const response = await api.post(`/music/${id}/downvote`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Add new music
  addMusic: async (formData) => {
    try {
      const response = await api.post('/admin/music', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Update music
  updateMusic: async (id, data) => {
    try {
      const response = await api.put(`/admin/music/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Delete music
  deleteMusic: async (id) => {
    try {
      const response = await api.delete(`/admin/music/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Auth API calls
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default api;
