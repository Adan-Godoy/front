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

interface ChatbotResponse {
  statusCode: number;
  message: string;
  data: {
    response: string;
  };
}

// Función para iniciar sesión
export const login = async (email: string, password: string): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; error?: string }> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    // Guardar tokens en localStorage
    const { accessToken, refreshToken, id } = response.data.data;


    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem("userId", id);

    
    return { success: true, accessToken, refreshToken };

  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error al iniciar sesión:', axiosError.response?.data?.message || axiosError.message);
    return { success: false, error: axiosError.response?.data?.message || axiosError.message };
  }
};

// Función para registrar un usuario
export const register = async (data: { email: string; password: string; username: string; fullName: string }): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await api.post('/auth/register', data);
    return { success: true, message: 'Usuario registrado exitosamente' };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error al registrar usuario:', axiosError.response?.data?.message || axiosError.message);
    return { success: false, error: axiosError.response?.data?.message || axiosError.message };
  }
};


// Función para enviar mensaje al chatbot
export const sendChatMessage = async (prompt: string): Promise<ChatbotResponse> => {
  try {
    const response = await api.post<ChatbotResponse>('/chatbot/message', { prompt });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error en el chatbot:', axiosError.response?.data?.message || axiosError.message);
    return {
      statusCode: 500,
      message: 'Error interno del servidor',
      data: {
        response: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.'
      }
    };
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