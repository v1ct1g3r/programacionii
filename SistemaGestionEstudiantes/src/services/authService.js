/*
  authService.js
  Este archivo maneja todos los servicios relacionados con la autenticación (inicio y cierre de sesión).
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Los servicios son funciones auxiliares que aíslan las llamadas a la API de los componentes visuales.
  De este modo, si cambia la forma de autenticar, solo editamos este archivo y no cada página web.
*/

import api from './api';

// Nombre de la clave que usaremos para guardar el token en el almacenamiento local del navegador.
const CLAVE_TOKEN = 'sesion_token';
const CLAVE_USUARIO = 'sesion_usuario';

export const authService = {
  /**
   * Inicia sesión con el email y contraseña provistos.
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<object>} Datos del usuario logueado
   */
  iniciarSesion: async (email, password) => {
    // Realizamos la petición POST usando Axios
    const respuesta = await api.post('/auth/login', { email, password });
    
    // Si la llamada fue exitosa, guardamos los datos en localStorage
    const { token, usuario } = respuesta.data;
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    
    return usuario;
  },

  /**
   * Cierra la sesión activa borrando la información guardada.
   */
  cerrarSesion: () => {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
  },

  /**
   * Obtiene los datos del usuario actualmente logueado si existe sesión.
   * @returns {object|null} Datos del usuario o null si no ha iniciado sesión
   */
  obtenerUsuarioActual: () => {
    const usuarioString = localStorage.getItem(CLAVE_USUARIO);
    if (!usuarioString) return null;
    try {
      return JSON.parse(usuarioString);
    } catch (e) {
      return null;
    }
  },

  /**
   * Verifica si existe un token de sesión activo.
   * @returns {boolean} True si está autenticado
   */
  estaAutenticado: () => {
    return !!localStorage.getItem(CLAVE_TOKEN);
  }
};

export default authService;
