/*
  enrutador.js
  Este archivo define las páginas de la aplicación y las mapea a sus respectivos componentes.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  En lugar de configurar un enrutador complejo con librerías externas como React Router,
  usamos un simple mapa JavaScript. En App.jsx, leeremos qué clave está activa en el estado
  (ej. 'dashboard') y renderizaremos el componente correspondiente. ¡Sencillo e infalible!
*/

import DashboardPage from '../pages/DashboardPage';
import EstudiantesPage from '../pages/EstudiantesPage';
import CursosPage from '../pages/CursosPage';
import CalificacionesPage from '../pages/CalificacionesPage';
import PerfilPage from '../pages/PerfilPage';

// Mapa de páginas accesibles
export const VISTAS = {
  dashboard: DashboardPage,
  estudiantes: EstudiantesPage,
  cursos: CursosPage,
  calificaciones: CalificacionesPage,
  perfil: PerfilPage
};

// Página de inicio por defecto
export const PAGINA_INICIAL = 'dashboard';
