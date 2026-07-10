import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export const chatWithAssistant = async (message: string, history: any[] = []) => {
  const response = await api.post('/chat', { message, history });
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settings: any) => {
  const response = await api.post('/settings', settings);
  return response.data;
};
