/*
  useEstudiantes.js
  Este hook personalizado facilita el acceso al contexto global de estudiantes.
*/

import { useContext } from 'react';
import { EstudianteContext } from '../context/EstudianteContext';

export const useEstudiantes = () => {
  const contexto = useContext(EstudianteContext);
  
  if (!contexto) {
    throw new Error('useEstudiantes debe ser utilizado dentro de un EstudianteProvider');
  }
  
  return contexto;
};

export default useEstudiantes;
