import axios from 'axios';
import { supabase } from './supabase';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor para inyectar automáticamente el token de Supabase en cada petición
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isAlertShowing = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Error capturado por el interceptor:', error.response);

    const status = error.response ? error.response.status : null;

    if (status === 401 || status === 403) {
      if (!isAlertShowing) {
        isAlertShowing = true;

        supabase.auth.signOut();

        Swal.fire({
          title: 'Sesión Caducada',
          text: 'Tu sesión ha expirado o es inválida. Por favor, ingresa nuevamente.',
          icon: 'warning',
          confirmButtonText: 'Ir al Login',
          confirmButtonColor: '#4F46E5',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          isAlertShowing = false;
          window.location.href = '/login';
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;