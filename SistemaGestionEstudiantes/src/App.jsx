/*
  App.jsx
  Componente raíz de la aplicación.
*/

import React, { useState } from 'react';

// Estilos globales y específicos
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { EstudianteProvider } from './context/EstudianteContext';

// Hooks
import useAuth from './hooks/useAuth';

// Componentes comunes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Enrutador y Login
import { VISTAS, PAGINA_INICIAL } from './routes/enrutador';
import LoginPage from './pages/LoginPage';

/**
 * Subcomponente interno para poder usar el hook `useAuth`.
 * Los hooks de un contexto solo se pueden usar en componentes
 * que estén dentro del Provider correspondiente.
 */
const ContenidoApp = () => {
  const { estaAutenticado, cargando } = useAuth();
  
  // Estado que guarda la página activa del menú de navegación (ej: 'dashboard', 'estudiantes', etc.)
  const [paginaActiva, setPaginaActiva] = useState(PAGINA_INICIAL);

  // 1. Si la aplicación está comprobando la sesión en localStorage, muestra pantalla de carga
  if (cargando) {
    return <Loader mensaje="Verificando credenciales..." pantallaCompleta={true} />;
  }

  // 2. Si el profesor no ha iniciado sesión, forzamos la vista del Login
  if (!estaAutenticado) {
    return <LoginPage />;
  }

  // 3. Si el profesor ya inició sesión, resolvemos el componente de la página activa
  const ComponentePagina = VISTAS[paginaActiva] || VISTAS.dashboard;

  return (
    <div className="layout-app">
      {/* Barra de navegación superior */}
      <Navbar paginaActiva={paginaActiva} setPaginaActiva={setPaginaActiva} />
      
      {/* Contenedor del contenido variable (páginas) */}
      <main className="contenido-principal">
        <ComponentePagina />
      </main>
      
      {/* Pie de página */}
      <Footer />
    </div>
  );
};

// Componente principal que se exporta y monta en el DOM
export const App = () => {
  return (
    <AuthProvider>
      <EstudianteProvider>
        <ContenidoApp />
      </EstudianteProvider>
    </AuthProvider>
  );
};

export default App;
