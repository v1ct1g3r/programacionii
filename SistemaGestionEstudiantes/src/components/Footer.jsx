/*
  Footer.jsx
  Componente sencillo para el pie de página de la aplicación.
*/

import React from 'react';

export const Footer = () => {
  const anioActual = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="contenedor">
        <p>&copy; {anioActual} Sistema de Gestión de Estudiantes. Diseñado para fines educativos.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--color-texto-debil)' }}>
          Panel de Control del Docente • Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
