/*
  CardCurso.jsx
  Muestra información de un curso específico de forma resumida en una tarjeta interactiva.
  
  PROPS:
  - curso (object): Objeto con { id, codigo, nombre, aula, docente }.
  - totalEstudiantes (number): Cantidad de alumnos que cursan esta materia.
  - promedioCurso (number): El promedio actual del curso.
*/

import React from 'react';

export const CardCurso = ({ curso, totalEstudiantes = 0, promedioCurso = 0 }) => {
  // Función para determinar el color de la barra de promedio
  const obtenerColorPromedio = (nota) => {
    if (nota >= 8) return 'var(--color-exito)';
    if (nota >= 6) return 'var(--color-advertencia)';
    return 'var(--color-error)';
  };

  return (
    <div className="card-curso">
      <div className="card-curso-cabecera">
        <div>
          <span className="card-curso-codigo">{curso.codigo}</span>
          <h3 className="card-curso-titulo">{curso.nombre}</h3>
        </div>
      </div>

      <div className="card-curso-detalles">
        <div className="card-curso-info-item">
          <span>Aula:</span>
          <strong>{curso.aula}</strong>
        </div>
        <div className="card-curso-info-item">
          <span>Profesor:</span>
          <span>{curso.docente}</span>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-borde)', margin: '0.25rem 0' }} />

        {/* Métrica de Estudiantes Inscritos */}
        <div className="card-curso-info-item">
          <span>Estudiantes Inscritos:</span>
          <strong>{totalEstudiantes}</strong>
        </div>

        {/* Métrica de Promedio de Notas */}
        <div className="card-curso-info-item">
          <span>Promedio del Curso:</span>
          <strong style={{ color: obtenerColorPromedio(promedioCurso) }}>
            {promedioCurso > 0 ? promedioCurso : 'Sin Notas'}
          </strong>
        </div>

        {/* Barra de Progreso Visual para el promedio (0-10) */}
        {promedioCurso > 0 && (
          <div>
            <div className="barra-progreso-contenedor">
              <div 
                className="barra-progreso-relleno" 
                style={{ 
                  width: `${promedioCurso * 10}%`, 
                  backgroundColor: obtenerColorPromedio(promedioCurso) 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardCurso;
