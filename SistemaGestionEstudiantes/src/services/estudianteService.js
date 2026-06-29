/*
  estudianteService.js
  Este archivo maneja todas las llamadas CRUD (Crear, Leer, Actualizar, Borrar) para los Estudiantes.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Cada función es asíncrona (`async`) porque las peticiones web toman tiempo en viajar al servidor 
  (o simular la carga). Usamos `await` para esperar a que Axios complete la petición y nos devuelva la respuesta.
*/

import api from './api';

export const estudianteService = {
  /**
   * Obtiene la lista completa de todos los estudiantes registrados.
   * @returns {Promise<Array>} Lista de estudiantes
   */
  obtenerEstudiantes: async () => {
    const respuesta = await api.get('/estudiantes');
    // Devolvemos directamente el arreglo de datos
    return respuesta.data;
  },

  /**
   * Obtiene la información detallada de un estudiante específico.
   * @param {string} id - ID del estudiante
   * @returns {Promise<object>} Datos del estudiante
   */
  obtenerEstudiantePorId: async (id) => {
    const respuesta = await api.get(`/estudiantes/${id}`);
    return respuesta.data;
  },

  /**
   * Registra un nuevo estudiante en el sistema.
   * @param {object} datosEstudiante - Datos del estudiante (nombre, email, telefono)
   * @returns {Promise<object>} Estudiante creado (con su ID y matrícula autogenerados)
   */
  crearEstudiante: async (datosEstudiante) => {
    const respuesta = await api.post('/estudiantes', datosEstudiante);
    return respuesta.data;
  },

  /**
   * Actualiza la información de un estudiante existente.
   * @param {string} id - ID del estudiante a modificar
   * @param {object} datosActualizados - Nuevos datos del estudiante
   * @returns {Promise<object>} Estudiante modificado
   */
  actualizarEstudiante: async (id, datosActualizados) => {
    const respuesta = await api.put(`/estudiantes/${id}`, datosActualizados);
    return respuesta.data;
  },

  /**
   * Elimina un estudiante del sistema por su ID.
   * @param {string} id - ID del estudiante a borrar
   * @returns {Promise<object>} Datos del estudiante eliminado
   */
  eliminarEstudiante: async (id) => {
    const respuesta = await api.delete(`/estudiantes/${id}`);
    return respuesta.data;
  }
};

export default estudianteService;
