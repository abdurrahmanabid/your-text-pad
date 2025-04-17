// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getMe = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    // If 401, the interceptor will handle it
    throw error;
  }
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/login', credentials);
  return response.data;
};
export const saveFileToDB = async (fileData: {
  title: string;
  content: string;
}) => {
  const response = await api.post('/files', fileData);
  return response.data;
};

export const getFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};
// Add these to your existing API functions
export const getStoredFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const deleteStoredFile = async (fileId: string) => {
  const response = await api.delete(`/files/${fileId}`);
  return response.data;
};
export const logout = async () => {
  const response = await api.post('/logout');
  localStorage.removeItem('token');
  return response.data;
};