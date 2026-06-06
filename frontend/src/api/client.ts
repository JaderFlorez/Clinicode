import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Error de conexión';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;

// Helpers de respuesta
export const extractData = (response: { data: unknown }) => response.data;
export const extractList = (response: { data: { pacientes?: unknown; pacientesEncontrados?: unknown; AgendaMedico?: unknown; TotalAgendamientos?: unknown; [key: string]: unknown } }, key: string) =>
  response.data[key] ?? response.data.pacientes ?? response.data.AgendaMedico ?? [];
