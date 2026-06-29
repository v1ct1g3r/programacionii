/*
  Loader.jsx
  Componente visual para indicar que una operación asíncrona está cargando datos.
  
  PROPS:
  - mensaje (string): Texto opcional para mostrar debajo del spinner.
  - pantallaCompleta (boolean): Si es true, muestra un fondo translúcido que cubre toda la pantalla.
*/

import React from 'react';

export const Loader = ({ mensaje = 'Cargando datos...', pantallaCompleta = false }) => {
  const contenido = (
    <div className="loader-contenedor">
      {/* Spinner con animación CSS definida en components.css */}
      <div className="spinner"></div>
      <p style={{ color: 'var(--color-texto-secundario)', fontWeight: 500, fontSize: '0.9rem' }}>
        {mensaje}
      </p>
    </div>
  );

  if (pantallaCompleta) {
    return (
      <div className="loader-pantalla-completa">
        {contenido}
      </div>
    );
  }

  return contenido;
};

export default Loader;
