/*
  useCursos.js
  Este hook personalizado gestiona la carga de cursos.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  A diferencia de los estudiantes, los cursos no se editan en este sistema (son de solo lectura).
  Por tanto, no necesitan un contexto global. Este hook demuestra cómo encapsular la lógica de 
  obtención de datos usando `useState` y `useEffect` localmente, manteniendo el componente limpio.
*/

import { useState, useEffect } from 'react';
import cursoService from '../services/cursoService';

export const useCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarCursos = async () => {
    setCargando(true);
    setError(null);
    try {
      const listaCursos = await cursoService.obtenerCursos();
      setCursos(listaCursos);
    } catch (err) {
      setError('Error al obtener la lista de cursos.');
    } finally {
      setCargando(false);
    }
  };

  // Cargamos los cursos automáticamente cuando se usa el hook
  useEffect(() => {
    cargarCursos();
  }, []);

  return {
    cursos,
    cargando,
    error,
    refrescarCursos: cargarCursos
  };
};

export default useCursos;
