/*
  DashboardPage.jsx
  Panel de control principal.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Aquí es donde un docente obtiene un panorama rápido del rendimiento escolar.
  Consume tres hooks distintos para obtener el total de estudiantes, cursos y notas,
  y realiza cálculos en tiempo real (promedios, listados de destacados).
*/

import React, { useMemo } from 'react';
import useEstudiantes from '../hooks/useEstudiantes';
import useCursos from '../hooks/useCursos';
import useCalificaciones from '../hooks/useCalificaciones';

export const DashboardPage = () => {
  // Consumimos los estados globales
  const { estudiantes, cargando: cargandoEst } = useEstudiantes();
  const { cursos, cargando: cargandoCursos } = useCursos();
  const { 
    calificaciones, 
    obtenerPromedioGeneral, 
    obtenerPromedioEstudiante,
    cargando: cargandoCal 
  } = useCalificaciones();

  // Obtenemos la fecha actual con un formato legible
  const fechaActual = useMemo(() => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('es-ES', opciones);
  }, []);

  // Calculamos los 3 estudiantes con mejor promedio para la sección de destacados
  const estudiantesDestacados = useMemo(() => {
    if (estudiantes.length === 0) return [];
    
    // Mapeamos los estudiantes a una lista con sus promedios
    const estudiantesConPromedio = estudiantes.map(estudiante => ({
      ...estudiante,
      promedio: obtenerPromedioEstudiante(estudiante.id)
    }));

    // Filtramos los que tienen promedio mayor a cero (que ya tienen notas cargadas)
    // y los ordenamos de mayor a menor promedio
    return estudiantesConPromedio
      .filter(e => e.promedio > 0)
      .sort((a, b) => b.promedio - a.promedio)
      .slice(0, 3); // Tomamos los 3 primeros
  }, [estudiantes, calificaciones, obtenerPromedioEstudiante]);

  // Si alguno de los servicios principales está cargando, mostramos un spinner simple
  const cargandoCualquiera = cargandoEst || cargandoCursos || cargandoCal;

  return (
    <div className="dashboard-contenedor desvanecer-entrada">
      {/* Cabecera del Dashboard */}
      <div className="dashboard-cabecera">
        <div>
          <h2 className="dashboard-titulo">Panel de Control Docente</h2>
          <p className="dashboard-fecha">{fechaActual}</p>
        </div>
      </div>

      {/* Tarjetas de Estadísticas (Stats) */}
      <div className="dashboard-estadisticas">
        {/* Tarjeta: Total Estudiantes */}
        <div className="tarjeta-stat">
          <div className="stat-icono primario">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-valor">{cargandoCualquiera ? '...' : estudiantes.length}</span>
            <span className="stat-etiqueta">Estudiantes Registrados</span>
          </div>
        </div>

        {/* Tarjeta: Cursos Activos */}
        <div className="tarjeta-stat">
          <div className="stat-icono info">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-valor">{cargandoCualquiera ? '...' : cursos.length}</span>
            <span className="stat-etiqueta">Cursos Disponibles</span>
          </div>
        </div>

        {/* Tarjeta: Promedio General */}
        <div className="tarjeta-stat">
          <div className="stat-icono exito">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-valor">{cargandoCualquiera ? '...' : obtenerPromedioGeneral()}</span>
            <span className="stat-etiqueta">Promedio General</span>
          </div>
        </div>

        {/* Tarjeta: Rendimiento */}
        <div className="tarjeta-stat">
          <div className="stat-icono advertencia">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-valor">
              {cargandoCualquiera ? '...' : (estudiantesDestacados[0]?.promedio || 'N/A')}
            </span>
            <span className="stat-etiqueta">Nota Máxima Actual</span>
          </div>
        </div>
      </div>

      {/* Cuerpo Principal del Dashboard (Secciones) */}
      <div className="dashboard-cuerpo">
        {/* Sección: Estudiantes Destacados */}
        <div className="seccion-dashboard">
          <h3 className="seccion-dashboard-titulo">Alumnos con Mayor Rendimiento</h3>
          {cargandoCualquiera ? (
            <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-texto-secundario)' }}>Cargando ranking...</p>
          ) : estudiantesDestacados.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-texto-secundario)' }}>Aún no hay calificaciones cargadas para evaluar el rendimiento.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {estudiantesDestacados.map((estudiante, indice) => (
                <div 
                  key={estudiante.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-fondo)',
                    borderRadius: 'var(--radio-sm)',
                    borderLeft: `4px solid ${indice === 0 ? 'gold' : indice === 1 ? 'silver' : '#cd7f32'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-texto-secundario)', width: '20px' }}>
                      #{indice + 1}
                    </strong>
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{estudiante.nombre}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-texto-secundario)' }}>
                        {estudiante.matricula}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{ 
                        fontWeight: '700', 
                        fontSize: '1rem', 
                        color: 'var(--color-primario)',
                        backgroundColor: 'var(--color-primario-claro)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radio-xs)'
                      }}
                    >
                      {estudiante.promedio}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección: Actividades Recientes */}
        <div className="seccion-dashboard">
          <h3 className="seccion-dashboard-titulo">Actividad del Sistema</h3>
          <div className="lista-actividad">
            <div className="actividad-item">
              <div className="actividad-info">
                <span className="actividad-desc">Inicio de sesión exitoso del Profesor Carlos Ortega</span>
                <span className="actividad-tiempo">Hace unos instantes</span>
              </div>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-exito)' }}></span>
            </div>
            
            <div className="actividad-item">
              <div className="actividad-info">
                <span className="actividad-desc">Se sincronizaron {estudiantes.length} estudiantes desde la base de datos local</span>
                <span className="actividad-tiempo">Hace 5 minutos</span>
              </div>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-info)' }}></span>
            </div>

            <div className="actividad-item">
              <div className="actividad-info">
                <span className="actividad-desc">Carga inicial de cursos completada (MAT101, FIS102, PROG104)</span>
                <span className="actividad-tiempo">Hace 10 minutos</span>
              </div>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-info)' }}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
