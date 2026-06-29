/*
  Navbar.jsx
  Barra de navegación principal de la aplicación.
  
  PROPS:
  - paginaActiva (string): ID de la página actualmente renderizada.
  - setPaginaActiva (function): Modifica el estado de la página activa en App.jsx.
*/

import React from 'react';
import useAuth from '../hooks/useAuth';

export const Navbar = ({ paginaActiva, setPaginaActiva }) => {
  const { usuario, cerrarSesion } = useAuth();

  // Función auxiliar para saber si una opción está activa y aplicar estilos
  const obtenerClaseEnlace = (nombrePagina) => {
    return paginaActiva === nombrePagina ? 'navbar-enlace activo' : 'navbar-enlace';
  };

  return (
    <nav className="navbar">
      <div className="contenedor navbar-contenedor">
        {/* Marca y Logotipo */}
        <div className="navbar-marca" style={{ cursor: 'pointer' }} onClick={() => setPaginaActiva('dashboard')}>
          {/* Logo en SVG */}
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" />
            <path d="M3.82001 11.53V16.73L12 21.2L20.18 16.73V11.53L12 16L3.82001 11.53Z" opacity="0.8" />
          </svg>
          <span>Colegio San Agustín</span>
        </div>

        {/* Menú de Navegación */}
        <ul className="navbar-menu">
          <li>
            <button 
              className={obtenerClaseEnlace('dashboard')} 
              onClick={() => setPaginaActiva('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button 
              className={obtenerClaseEnlace('estudiantes')} 
              onClick={() => setPaginaActiva('estudiantes')}
            >
              Estudiantes
            </button>
          </li>
          <li>
            <button 
              className={obtenerClaseEnlace('cursos')} 
              onClick={() => setPaginaActiva('cursos')}
            >
              Cursos
            </button>
          </li>
          <li>
            <button 
              className={obtenerClaseEnlace('calificaciones')} 
              onClick={() => setPaginaActiva('calificaciones')}
            >
              Calificaciones
            </button>
          </li>
          <li>
            <button 
              className={obtenerClaseEnlace('perfil')} 
              onClick={() => setPaginaActiva('perfil')}
            >
              Mi Perfil
            </button>
          </li>
        </ul>

        {/* Sección de Usuario y Cierre de Sesión */}
        {usuario && (
          <div className="navbar-usuario">
            <div className="navbar-usuario-info">
              <div className="navbar-usuario-nombre">{usuario.nombre}</div>
              <div className="navbar-usuario-rol">{usuario.rol}</div>
            </div>
            
            {/* Botón de Logout */}
            <button 
              className="btn btn-secundario" 
              onClick={cerrarSesion}
              title="Cerrar Sesión"
              style={{ padding: '0.5rem' }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
