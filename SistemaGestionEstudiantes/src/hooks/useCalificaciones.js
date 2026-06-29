/*
  useCalificaciones.js
  Este hook personalizado maneja la carga, actualización y operaciones de cálculo de calificaciones.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Además de conectar con el servicio de calificaciones, este hook incluye funciones de utilidad
  para calcular promedios (por estudiante o por curso) que se usan en el Dashboard y la página de notas.
*/

import { useState, useEffect } from 'react';
import calificacionService from '../services/calificacionService';

export const useCalificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarCalificaciones = async () => {
    setCargando(true);
    setError(null);
    try {
      const listaCalificaciones = await calificacionService.obtenerCalificaciones();
      setCalificaciones(listaCalificaciones);
    } catch (err) {
      setError('Error al cargar las calificaciones.');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Guarda o actualiza la nota de un estudiante y refresca la lista.
   */
  const guardarCalificacion = async (estudianteId, cursoId, nota) => {
    setCargando(true);
    setError(null);
    try {
      await calificacionService.registrarCalificacion(estudianteId, cursoId, nota);
      // Recargamos las calificaciones desde el servidor local
      await cargarCalificaciones();
      return true;
    } catch (err) {
      setError('No se pudo guardar la calificación.');
      return false;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Calcula el promedio general de todas las notas del colegio.
   */
  const obtenerPromedioGeneral = () => {
    if (calificaciones.length === 0) return 0;
    const suma = calificaciones.reduce((acumulado, c) => acumulado + c.nota, 0);
    return parseFloat((suma / calificaciones.length).toFixed(1));
  };

  /**
   * Calcula el promedio de un estudiante específico sumando todas sus materias.
   */
  const obtenerPromedioEstudiante = (estudianteId) => {
    const notasEstudiante = calificaciones.filter(c => c.estudianteId === estudianteId);
    if (notasEstudiante.length === 0) return 0;
    const suma = notasEstudiante.reduce((acumulado, c) => acumulado + c.nota, 0);
    return parseFloat((suma / notasEstudiante.length).toFixed(1));
  };

  /**
   * Obtiene la nota de un estudiante en un curso específico.
   */
  const obtenerNotaEspecifica = (estudianteId, cursoId) => {
    const registro = calificaciones.find(c => c.estudianteId === estudianteId && c.cursoId === cursoId);
    return registro ? registro.nota : '';
  };

  /**
   * Calcula el promedio general de un curso específico.
   */
  const obtenerPromedioCurso = (cursoId) => {
    const notasCurso = calificaciones.filter(c => c.cursoId === cursoId);
    if (notasCurso.length === 0) return 0;
    const suma = notasCurso.reduce((acumulado, c) => acumulado + c.nota, 0);
    return parseFloat((suma / notasCurso.length).toFixed(1));
  };

  // Carga inicial
  useEffect(() => {
    cargarCalificaciones();
  }, []);

  return {
    calificaciones,
    cargando,
    error,
    guardarCalificacion,
    obtenerPromedioGeneral,
    obtenerPromedioEstudiante,
    obtenerNotaEspecifica,
    obtenerPromedioCurso,
    refrescarCalificaciones: cargarCalificaciones
  };
};

export default useCalificaciones;
