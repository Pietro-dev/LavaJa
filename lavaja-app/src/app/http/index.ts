// app/http.ts
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
});

const AUTO_LOGOUT_ON_401 = true;

// Helper para autenticação — declarado ANTES dos interceptors
export const authHelper = {
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  // 🔥 NOVA LÓGICA: Determina o tipo de usuário baseado nos IDs
  getUserType: (): 'ADMIN' | 'CLIENTE' | 'LAVA_RAPIDO' | null => {
    if (typeof window === 'undefined') return null;
    
    const usuarioId = localStorage.getItem('usuarioId');
    const lavaRapidoId = localStorage.getItem('lavaRapidoId');

    console.log('🔍 Determinando userType:', { usuarioId, lavaRapidoId });

    if (usuarioId === '1') {
      return 'ADMIN';
    } else if (lavaRapidoId) {
      return 'LAVA_RAPIDO';
    } else if (usuarioId) {
      return 'CLIENTE';
    }
    
    return null;
  },

  getUserId: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const userType = authHelper.getUserType();
    
    if (userType === 'ADMIN' || userType === 'CLIENTE') {
      return localStorage.getItem('usuarioId');
    } else if (userType === 'LAVA_RAPIDO') {
      return localStorage.getItem('lavaRapidoId');
    }
    
    return null;
  },

  setToken: (token: string, usuarioId?: string, userType?: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    if (usuarioId) localStorage.setItem('usuarioId', usuarioId);
    if (userType) localStorage.setItem('userType', userType);
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('authHelper.setToken -> token salvo (redacted):', token ? `${token.slice(0,10)}...` : null);
  },

  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('lavaRapidoId');
    delete httpClient.defaults.headers.common['Authorization'];
    console.log('🧹 Dados de autenticação removidos');
  },

  debug: (): void => {
    if (typeof window === 'undefined') return;
    console.log('🔍 Auth Debug:', {
      hasToken: !!localStorage.getItem('token'),
      token: localStorage.getItem('token') ? `${localStorage.getItem('token')!.slice(0,10)}...` : null,
      userType: authHelper.getUserType(), // 🔥 AGORA USA A NOVA LÓGICA
      usuarioId: localStorage.getItem('usuarioId'),
      lavaRapidoId: localStorage.getItem('lavaRapidoId'),
      axiosDefaultAuth: httpClient.defaults.headers.common['Authorization']
    });
  }
};

// Interceptor request: garante header Authorization antes de cada requisição
httpClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      config.headers = config.headers || {};
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token adicionado à requisição:', config.url);
      } else {
        console.warn('⚠️ Requisição sem token:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor response: agora só desloga automaticamente em 401 (configurável).
// httpClient.interceptors.response.use(
//   (response) => {
//     // logs úteis para debug
//     console.log('✅ Resposta recebida:', {
//       url: response.config.url,
//       status: response.status,
//     });
//     return response;
//   },
//   (error) => {
//     const status = error?.response?.status;
//     const url = error?.config?.url;
//     console.error('❌ Erro na resposta:', {
//       url,
//       method: error?.config?.method?.toUpperCase(),
//       status,
//       message: error?.message,
//       responseBody: error?.response?.data
//     });

//     if (typeof window !== 'undefined') {
//       // Só limpa e redireciona automaticamente em 401 (Token inválido/expirado)
//       if (status === 401 && AUTO_LOGOUT_ON_401) {
//         console.log('🔐 401 recebido - limpando auth e sugerindo login');
//         authHelper.clearAuth();
//         // Não forçamos window.location.href — deixamos a UI decidir. Se preferir forçar:
//         // window.location.href = '/login';
//       } else if (status === 403) {
//         // 403: autorizado, mas sem permissão — DEBUG: não limpar token automaticamente
//         console.warn('🔒 403 Forbidden — token presente mas sem permissão para o recurso', { url, status, responseBody: error?.response?.data });
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// Fetcher para SWR (opcional)
export const swrFetcher = (url: string) => {
  return httpClient.get(url).then(res => res.data);
};

export default httpClient;