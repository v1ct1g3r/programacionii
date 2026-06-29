/*
  calificacionService.js
  Este archivo maneja el registro y lectura de las calificaciones (notas) de los estudiantes.
*/

import api from './api';

export const calificacionService = {
  /**
   * Obtiene la lista completa de todas las calificaciones registradas.
   * @returns {Promise<Array>} Lista de calificaciones
   */
  obtenerCalificaciones: async () => {
    const respuesta = await api.get('/calificaciones');
    return respuesta.data;
  },

  /**
   * Registra o actualiza la nota de un estudiante en un curso particular.
   * @param {string} estudianteId - ID del estudiante
   * @param {string} cursoId - ID del curso
   * @param {number} nota - Calificación numérica (0 a 10)
   * @returns {Promise<object>} Calificación guardada
   */
  registrarCalificacion: async (estudianteId, cursoId, nota) => {
    const respuesta = await api.post('/calificaciones', { estudianteId, cursoId, nota });
    return respuesta.data;
  }
};

export default calificacionService;
