/*
  TablaEstudiantes.jsx
  Componente que dibuja una tabla con el listado de los estudiantes.
  
  PROPS:
  - estudiantes (Array): Lista de objetos estudiante a mostrar.
  - onEditar (function): Función ejecutada al presionar el botón "Editar".
  - onEliminar (function): Función ejecutada al presionar el botón "Eliminar".
  - obtenerPromedio (function): Función para calcular el promedio de un estudiante según su ID.
*/

import React from 'react';

export const TablaEstudiantes = ({ 
  estudiantes, 
  onEditar, 
  onEliminar,
  obtenerPromedio
}) => {
  
  // Función para obtener las iniciales de un nombre (ej: "Juan Pérez" -> "JP")
  const obtenerIniciales = (nombre) => {
    if (!nombre) return '?';
    const partes = nombre.split(' ');
    if (partes.length > 1) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre[0].toUpperCase();
  };

  // Determinar color de la etiqueta del promedio
  const obtenerEstiloPromedio = (promedio) => {
    if (promedio === 0) return { backgroundColor: '#f3f4f6', color: '#6b7280' }; // Sin notas
    if (promedio >= 8) return { backgroundColor: '#d1fae5', color: '#065f46' }; // Sobresaliente
    if (promedio >= 6) return { backgroundColor: '#fef3c7', color: '#92400e' }; // Aprobado
    return { backgroundColor: '#fee2e2', color: '#991b1b' }; // Reprobado
  };

  return (
    <div className="tabla-contenedor desvanecer-entrada">
      {estudiantes.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-texto-secundario)' }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ marginBottom: '1rem', opacity: 0.5 }}
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <p>No se encontraron estudiantes en el registro.</p>
        </div>
      ) : (
        <table className="tabla-datos">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Matrícula</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th style={{ textAlign: 'center' }}>Promedio</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => {
              const promedio = obtenerPromedio ? obtenerPromedio(estudiante.id) : 0;
              
              return (
                <tr key={estudiante.id}>
                  {/* Celda del nombre con Avatar */}
                  <td>
                    <div className="avatar-nombre">
                      <div className="avatar-iniciales">
                        {obtenerIniciales(estudiante.nombre)}
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                          {estudiante.nombre}
                        </strong>
                      </div>
                    </div>
                  </td>
                  
                  {/* Matrícula */}
                  <td>
                    <code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {estudiante.matricula}
                    </code>
                  </td>
                  
                  {/* Correo */}
                  <td>{estudiante.email}</td>
                  
                  {/* Teléfono */}
                  <td>{estudiante.telefono || 'Sin teléfono'}</td>
                  
                  {/* Promedio General */}
                  <td style={{ textAlign: 'center' }}>
                    <span 
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radio-completo)',
                        fontWeight: '600',
                        fontSize: '0.8125rem',
                        ...obtenerEstiloPromedio(promedio)
                      }}
                    >
                      {promedio > 0 ? promedio : 'N/A'}
                    </span>
                  </td>
                  
                  {/* Botones de acción */}
                  <td style={{ textAlign: 'center' }}>
                    <div className="acciones-celda" style={{ justifyContent: 'center' }}>
                      {/* Botón Editar */}
                      <button 
                        type="button"
                        className="btn-icono btn-icono-editar"
                        onClick={() => onEditar(estudiante)}
                        title="Editar Estudiante"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9"/>
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                        </svg>
                      </button>

                      {/* Botón Eliminar */}
                      <button 
                        type="button"
                        className="btn-icono btn-icono-eliminar"
                        onClick={() => onEliminar(estudiante.id)}
                        title="Eliminar Estudiante"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaEstudiantes;
