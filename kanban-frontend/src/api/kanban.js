// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Boards API
export const boardsApi = {
    getAll: () => api.get('/boards'),
    getOne: (id) => api.get(`/boards/${id}`),
    create: (data) => api.post('/boards', data),
    update: (id, data) => api.patch(`/boards/${id}`, data),
    delete: (id) => api.delete(`/boards/${id}`),
  };

// Columns API
export const columnsApi = {
    getAll: () => api.get('/columns'),
    getOne: (id) => api.get(`/columns/${id}`),
    create: (data) => api.post('/columns', data),
    update: (id, data) => api.patch(`/columns/${id}`, data),
    delete: (id) => api.delete(`/columns/${id}`),
  };

// Tasks API
export const tasksApi = {
  getAll: () => api.get('/tasks'),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Subtasks API
export const subtasksApi = {
  getAll: () => api.get('/subtasks'),
  getOne: (id) => api.get(`/subtasks/${id}`),
  create: (data)  => api.post('/subtasks', data),
  update: (id, data) => api.patch(`/subtasks/${id}`, data),
  delete: (id) => api.delete(`/subtasks/${id}`),
};