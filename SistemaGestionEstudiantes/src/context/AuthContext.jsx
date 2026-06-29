/*
  AuthContext.jsx
  Este archivo define el Contexto de Autenticación de la aplicación.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  El "Contexto" en React es como una "nube de datos" que flota sobre toda la aplicación.
  Permite compartir información (como qué usuario ha iniciado sesión) con cualquier componente, 
  sin tener que pasarla manualmente de padre a hijo a través de props en muchos niveles.
*/

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// 1. Creamos el contexto. Este objeto será usado por el hook para obtener los datos.
export const AuthContext = createContext();

// 2. Definimos el "Proveedor" (Provider). Es el componente que envolverá la App 
//    y proveerá los datos reales del estado a todos sus descendientes.
export const AuthProvider = ({ children }) => {
  // Estado para guardar la información del usuario logueado.
  const [usuario, setUsuario] = useState(null);
  
  // Estado para indicar si estamos comprobando si hay una sesión activa al iniciar la app.
  const [cargando, setCargando] = useState(true);
  
  // Estado para guardar algún error de inicio de sesión.
  const [errorAuth, setErrorAuth] = useState(null);

  // Al cargar el componente por primera vez (montaje), revisamos si ya había una sesión guardada.
  useEffect(() => {
    const verificarSesion = () => {
      const usuarioActivo = authService.obtenerUsuarioActual();
      if (usuarioActivo) {
        setUsuario(usuarioActivo);
      }
      // Terminamos de verificar la carga inicial
      setCargando(false);
    };

    verificarSesion();
  }, []);

  /**
   * Función para iniciar sesión.
   * Llama al servicio de autenticación y actualiza el estado.
   */
  const iniciarSesion = async (email, password) => {
    setCargando(true);
    setErrorAuth(null);
    try {
      const usuarioLogueado = await authService.iniciarSesion(email, password);
      setUsuario(usuarioLogueado);
      return true; // Éxito
    } catch (error) {
      // Capturamos el mensaje de error del servidor simulado
      const mensajeError = error.response?.data?.mensaje || 'Error al conectar con el servidor';
      setErrorAuth(mensajeError);
      return false; // Fallo
    } finally {
      setCargando(false);
    }
  };

  /**
   * Función para cerrar la sesión.
   * Limpia el estado de React y borra el localStorage.
   */
  const cerrarSesion = () => {
    authService.cerrarSesion();
    setUsuario(null);
    setErrorAuth(null);
  };

  /**
   * Actualiza el perfil del docente en el estado y en localStorage.
   */
  const actualizarPerfil = (nuevosDatos) => {
    if (!usuario) return false;
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    setUsuario(usuarioActualizado);
    localStorage.setItem('sesion_usuario', JSON.stringify(usuarioActualizado));
    
    // Sincronizamos en la "base de datos" de usuarios
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], ...nuevosDatos };
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    return true;
  };

  // Los valores que queremos exponer a toda la aplicación
  const datosExpuestos = {
    usuario,
    cargando,
    errorAuth,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    estaAutenticado: !!usuario
  };

  // Retornamos el proveedor del contexto pasando los valores mediante el prop 'value'.
  // {children} representa a todos los componentes que estarán dentro de este proveedor.
  return (
    <AuthContext.Provider value={datosExpuestos}>
      {children}
    </AuthContext.Provider>
  );
};
