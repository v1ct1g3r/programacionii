/*
  CursosPage.jsx
  Página que muestra la oferta de materias impartidas por el docente.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Utiliza el hook `useCursos` para obtener las materias.
  Para cada materia, renderiza una tarjeta (`CardCurso`) pasándole los datos dinámicos 
  calculados (cantidad de alumnos inscritos en ese curso y el promedio actual).
*/

import React from 'react';
import useCursos from '../hooks/useCursos';
import useCalificaciones from '../hooks/useCalificaciones';
import CardCurso from '../components/CardCurso';
import Loader from '../components/Loader';

export const CursosPage = () => {
  const { cursos, cargando: cargandoCursos, error: errorCursos } = useCursos();
  const { calificaciones, obtenerPromedioCurso, cargando: cargandoCal } = useCalificaciones();

  const cargando = cargandoCursos || cargandoCal;

  // Calcula cuántos estudiantes tienen calificaciones registradas en un curso específico
  const calcularEstudiantesInscritos = (cursoId) => {
    // Filtramos las calificaciones asociadas a este curso
    const notasDelCurso = calificaciones.filter((c) => c.cursoId === cursoId);
    
    // Obtenemos una lista de IDs de estudiantes únicos (por si acaso hubiera duplicados)
    const estudiantesUnicos = [...new Set(notasDelCurso.map((c) => c.estudianteId))];
    
    return estudiantesUnicos.length;
  };

  return (
    <div className="contenedor desvanecer-entrada">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="dashboard-titulo">Cursos Asignados</h2>
        <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
          Gestione las asignaturas y consulte el estado y rendimiento académico por materia.
        </p>
      </div>

      {cargando ? (
        <Loader mensaje="Cargando cursos..." />
      ) : errorCursos ? (
        <div style={{ padding: '2rem', backgroundColor: 'var(--color-error-claro)', color: 'var(--color-error)', borderRadius: 'var(--radio-md)', textAlign: 'center' }}>
          {errorCursos}
        </div>
      ) : (
        <div className="cursos-grid">
          {cursos.map((curso) => {
            const inscritos = calcularEstudiantesInscritos(curso.id);
            const promedio = obtenerPromedioCurso(curso.id);

            return (
              <CardCurso
                key={curso.id}
                curso={curso}
                totalEstudiantes={inscritos}
                promedioCurso={promedio}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CursosPage;
