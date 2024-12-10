import axios, { AxiosError } from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces para los datos
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

interface ErrorResponse {
  message: string;
}

// Función para iniciar sesión
export const login = async (email: string, password: string): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; error?: string }> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    // Guardar tokens en localStorage
    const { accessToken, refreshToken } = response.data;
    console.log("Response data:", response.data);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { success: true, accessToken, refreshToken };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error al iniciar sesión:', axiosError.response?.data?.message || axiosError.message);
    return { success: false, error: axiosError.response?.data?.message || axiosError.message };
  }
};

// Función para registrar un usuario
export const register = async (email: string, password: string): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; error?: string }> => {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', { email, password });

    // Guardar tokens en localStorage
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { success: true, accessToken, refreshToken };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error al registrar usuario:', axiosError.response?.data?.message || axiosError.message);
    return { success: false, error: axiosError.response?.data?.message || axiosError.message };
  }
};

// Función para obtener los tokens del localStorage
export const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

// Función para eliminar los tokens del localStorage
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export default api;