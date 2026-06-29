/*
  cursoService.js
  Este archivo maneja las llamadas de lectura para los Cursos disponibles.
*/

import api from './api';

export const cursoService = {
  /**
   * Obtiene la lista completa de todos los cursos disponibles.
   * @returns {Promise<Array>} Lista de cursos
   */
  obtenerCursos: async () => {
    const respuesta = await api.get('/cursos');
    return respuesta.data;
  },

  /**
   * Obtiene los detalles de un curso por su ID.
   * @param {string} id - ID del curso
   * @returns {Promise<object>} Datos del curso
   */
  obtenerCursoPorId: async (id) => {
    const respuesta = await api.get(`/cursos/${id}`);
    return respuesta.data;
  }
};

export default cursoService;
