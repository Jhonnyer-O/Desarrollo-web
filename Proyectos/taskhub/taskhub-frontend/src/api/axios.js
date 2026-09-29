import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isAlertShowing = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Imprime el error exacto en consola para depurar
    console.log('Error capturado por el interceptor:', error.response);

    const status = error.response ? error.response.status : null;

    // Captura 401 (No autorizado) o 403 (Prohibido/Token inválido)
    if (status === 401 || status === 403) {
      if (!isAlertShowing) {
        isAlertShowing = true;

        localStorage.removeItem('token');
        localStorage.removeItem('user');

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