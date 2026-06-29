/*
  useAuth.js
  Este hook personalizado facilita el acceso al contexto de autenticación.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  En lugar de escribir `import { useContext } from 'react'` y `import { AuthContext } from '../context/AuthContext'`
  en cada componente que necesite saber si el usuario está logueado, simplemente importamos este hook:
  `const { usuario, cerrarSesion } = useAuth();`. ¡Es mucho más limpio y legible!
*/

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const contexto = useContext(AuthContext);
  
  // Si intentamos usar el hook fuera del Proveedor (AuthProvider), lanzamos un error descriptivo.
  if (!contexto) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  
  return contexto;
};

export default useAuth;
