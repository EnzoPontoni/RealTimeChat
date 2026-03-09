import axios from 'axios';

const PROD_API_URL = 'https://pontonischat-production.up.railway.app';
const API_URL = import.meta.env.VITE_API_URL
  || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : PROD_API_URL);

// Instância do axios com configurações padrão
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
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

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============

export const authAPI = {
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// ============ ROOM ENDPOINTS ============

export const roomAPI = {
  getAllRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getRoomById: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  createRoom: async (name, description) => {
    const response = await api.post('/rooms', {
      name,
      description,
    });
    return response.data;
  },

  deleteRoom: async (roomId) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },
};

// ============ MESSAGE ENDPOINTS ============

export const messageAPI = {
  getRoomMessages: async (roomId) => {
    const response = await api.get(`/messages/room/${roomId}`);
    return response.data;
  },

  sendMessage: async (roomId, content) => {
    const response = await api.post('/messages', {
      roomId,
      content,
    });
    return response.data;
  },
};

export default api;
