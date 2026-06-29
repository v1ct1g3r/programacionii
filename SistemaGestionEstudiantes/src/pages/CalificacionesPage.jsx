/*
  CalificacionesPage.jsx
  Página para la gestión de notas y calificaciones por curso.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Aquí combinamos tres fuentes de datos: cursos, estudiantes y calificaciones.
  1. El docente selecciona un curso de la lista.
  2. Al seleccionarlo, se muestran los estudiantes registrados.
  3. El docente puede editar la calificación de cada alumno directamente en un input.
  4. Presionar "Guardar" llama al servicio para persistir la nota en localStorage.
  
  Incluye validación para evitar que el docente guarde notas menores a 0 o mayores a 10.
*/

import React, { useState, useEffect } from 'react';
import useCursos from '../hooks/useCursos';
import useEstudiantes from '../hooks/useEstudiantes';
import useCalificaciones from '../hooks/useCalificaciones';
import Loader from '../components/Loader';

export const CalificacionesPage = () => {
  const { cursos, cargando: cargandoCursos } = useCursos();
  const { estudiantes, cargando: cargandoEst } = useEstudiantes();
  const { 
    guardarCalificacion, 
    obtenerNotaEspecifica, 
    obtenerPromedioCurso, 
    cargando: cargandoCal 
  } = useCalificaciones();

  // Estado del curso seleccionado
  const [cursoId, setCursoId] = useState('');
  
  // Estado local para los inputs de las notas (mapea estudianteId -> nota)
  const [notasLocales, setNotasLocales] = useState({});

  // ID del estudiante que se está guardando en el momento (para feedback visual)
  const [idGuardando, setIdGuardando] = useState(null);
  
  // Guardar mensaje de éxito temporal por estudiante
  const [exitosLocales, setExitosLocales] = useState({});

  // Sincroniza las calificaciones reales al cargar la página o cambiar el curso
  useEffect(() => {
    if (cursoId) {
      const notasNuevas = {};
      estudiantes.forEach((estudiante) => {
        const notaGuardada = obtenerNotaEspecifica(estudiante.id, cursoId);
        // Si tiene nota, la colocamos, si no, dejamos el input en blanco
        notasNuevas[estudiante.id] = notaGuardada !== undefined ? notaGuardada.toString() : '';
      });
      setNotasLocales(notasNuevas);
      // Limpiamos los mensajes de éxito anteriores
      setExitosLocales({});
    }
  }, [cursoId, estudiantes, obtenerNotaEspecifica]);

  // Si no se han cargado cursos o alumnos principales, mostramos cargando
  const cargandoInicial = cargandoCursos || cargandoEst;

  /**
   * Actualiza el estado local de la nota de un estudiante mientras escribe.
   */
  const manejarCambioNota = (estudianteId, valor) => {
    // Permitimos números, comas, o cadena vacía para borrar la nota
    setNotasLocales((prev) => ({
      ...prev,
      [estudianteId]: valor
    }));
  };

  /**
   * Guarda la nota de un estudiante específico en la base de datos simulada.
   */
  const guardarNotaEstudiante = async (estudianteId) => {
    const valorNota = notasLocales[estudianteId];
    
    // Validamos que sea un número válido
    const notaNumerica = parseFloat(valorNota);
    
    if (valorNota.trim() === '' || isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 10) {
      alert('La calificación debe ser un número decimal entre 0 y 10 (ej. 8.5).');
      return;
    }

    setIdGuardando(estudianteId);
    
    // Llamamos a la función guardar nota del Hook
    const exito = await guardarCalificacion(estudianteId, cursoId, notaNumerica);
    
    if (exito) {
      // Activamos el feedback de éxito para este estudiante
      setExitosLocales((prev) => ({ ...prev, [estudianteId]: true }));
      // Borramos el feedback de éxito después de 2.5 segundos
      setTimeout(() => {
        setExitosLocales((prev) => ({ ...prev, [estudianteId]: false }));
      }, 2500);
    }
    
    setIdGuardando(null);
  };

  // Obtenemos los detalles del curso seleccionado
  const cursoSeleccionado = cursos.find((c) => c.id === cursoId);

  return (
    <div className="contenedor desvanecer-entrada">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="dashboard-titulo">Registro de Calificaciones</h2>
        <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
          Seleccione una materia para ver la lista de estudiantes inscritos e ingresar sus calificaciones.
        </p>
      </div>

      {cargandoInicial ? (
        <Loader mensaje="Cargando panel de notas..." />
      ) : (
        <div className="calificaciones-cabecera">
          {/* Selector de Curso */}
          <div className="selector-curso-tarjeta">
            <div className="grupo-formulario">
              <label htmlFor="selector-curso">Asignatura</label>
              <select
                id="selector-curso"
                className="input-control"
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
              >
                <option value="">-- Seleccione una materia --</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} - {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Muestra el promedio dinámico del curso si se ha seleccionado uno */}
            {cursoSeleccionado && (
              <div 
                style={{ 
                  backgroundColor: 'var(--color-primario-claro)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: 'var(--radio-md)', 
                  borderLeft: '4px solid var(--color-primario)',
                  minWidth: '220px'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--color-texto-secundario)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                  Promedio del Curso
                </span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--color-primario)' }}>
                  {obtenerPromedioCurso(cursoId) || 'Sin calificaciones'}
                </strong>
              </div>
            )}
          </div>

          {/* Tabla de Calificaciones si hay un curso seleccionado */}
          {cursoId ? (
            <div className="calificaciones-tabla-entrada desvanecer-entrada">
              <h3 className="seccion-dashboard-titulo">Listado de Notas - {cursoSeleccionado?.nombre}</h3>
              
              {estudiantes.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-texto-secundario)' }}>
                  No hay estudiantes registrados en el sistema. Vaya a la sección de Estudiantes para registrar uno.
                </p>
              ) : (
                <table className="tabla-datos">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Matrícula</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>Calificación (0 - 10)</th>
                      <th style={{ width: '180px', textAlign: 'center' }}>Estado Guardado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantes.map((estudiante) => {
                      const nota = notasLocales[estudiante.id] || '';
                      const guardando = idGuardando === estudiante.id;
                      const exito = exitosLocales[estudiante.id];

                      return (
                        <tr key={estudiante.id}>
                          <td>
                            <strong>{estudiante.nombre}</strong>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-texto-secundario)' }}>
                              {estudiante.email}
                            </span>
                          </td>
                          <td>
                            <code style={{ fontSize: '0.8rem' }}>{estudiante.matricula}</code>
                          </td>
                          
                          {/* Entrada de Nota */}
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              className="input-control input-nota"
                              placeholder="N/A"
                              value={nota}
                              onChange={(e) => manejarCambioNota(estudiante.id, e.target.value)}
                              disabled={guardando}
                            />
                          </td>

                          {/* Acciones de Guardar por estudiante */}
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                              <button
                                type="button"
                                className="btn btn-primario"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                onClick={() => guardarNotaEstudiante(estudiante.id)}
                                disabled={guardando}
                              >
                                {guardando ? 'Guardando...' : 'Guardar'}
                              </button>
                              
                              {/* Feedback Visual de éxito */}
                              {exito && (
                                <span style={{ color: 'var(--color-exito)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                  Listo
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', border: '2px dashed var(--color-borde)', borderRadius: 'var(--radio-md)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-texto-debil)', marginBottom: '1rem' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <h4 style={{ color: 'var(--color-texto-secundario)', fontWeight: 500 }}>
                Por favor, elija una asignatura para habilitar la planilla de calificaciones.
              </h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalificacionesPage;
