/*
  EstudianteContext.jsx
  Este archivo maneja el contexto global para la lista de estudiantes.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Con este contexto, cuando agregamos, editamos o eliminamos un estudiante en una pantalla,
  la lista se actualiza automáticamente en toda la aplicación (como el Dashboard y el buscador)
  sin necesidad de recargar la página o hacer múltiples llamadas redundantes.
*/

import React, { createContext, useState, useEffect } from 'react';
import estudianteService from '../services/estudianteService';

// 1. Creamos el contexto.
export const EstudianteContext = createContext();

// 2. Definimos el Proveedor del contexto de estudiantes.
export const EstudianteProvider = ({ children }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carga la lista de estudiantes desde el servicio.
   */
  const obtenerListaEstudiantes = async () => {
    setCargando(true);
    setError(null);
    try {
      const lista = await estudianteService.obtenerEstudiantes();
      setEstudiantes(lista);
    } catch (err) {
      setError('No se pudo cargar la lista de estudiantes.');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Agrega un nuevo estudiante llamando al servicio y actualizando el estado local.
   */
  const agregarEstudiante = async (datosEstudiante) => {
    setCargando(true);
    setError(null);
    try {
      const estudianteCreado = await estudianteService.crearEstudiante(datosEstudiante);
      // Actualizamos el estado agregando el nuevo estudiante a la lista existente
      setEstudiantes((estudiantesActuales) => [...estudiantesActuales, estudianteCreado]);
      return true;
    } catch (err) {
      setError('Error al registrar el estudiante.');
      return false;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Edita un estudiante llamando al servicio y actualizando el estado local.
   */
  const editarEstudiante = async (id, datosActualizados) => {
    setCargando(true);
    setError(null);
    try {
      const estudianteModificado = await estudianteService.actualizarEstudiante(id, datosActualizados);
      // Reemplazamos el estudiante modificado en la lista del estado
      setEstudiantes((estudiantesActuales) =>
        estudiantesActuales.map((e) => (e.id === id ? estudianteModificado : e))
      );
      return true;
    } catch (err) {
      setError('Error al actualizar la información del estudiante.');
      return false;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Elimina un estudiante llamando al servicio y actualizando el estado local.
   */
  const eliminarEstudiante = async (id) => {
    setCargando(true);
    setError(null);
    try {
      await estudianteService.eliminarEstudiante(id);
      // Filtramos la lista para remover al estudiante eliminado
      setEstudiantes((estudiantesActuales) => estudiantesActuales.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el estudiante.');
      return false;
    } finally {
      setCargando(false);
    }
  };

  // Cargamos los estudiantes automáticamente cuando el proveedor se monta
  useEffect(() => {
    obtenerListaEstudiantes();
  }, []);

  const valoresExpuestos = {
    estudiantes,
    cargando,
    error,
    obtenerListaEstudiantes,
    agregarEstudiante,
    editarEstudiante,
    eliminarEstudiante
  };

  return (
    <EstudianteContext.Provider value={valoresExpuestos}>
      {children}
    </EstudianteContext.Provider>
  );
};
