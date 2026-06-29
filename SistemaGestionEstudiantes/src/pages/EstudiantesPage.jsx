/*
  EstudiantesPage.jsx
  Página de gestión y administración de estudiantes.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Esta página implementa un CRUD completo. Coordina qué vista mostrar usando una variable de 
  estado llamada `vista` ('tabla', 'formulario').
  - Si vista === 'tabla': muestra la barra de búsqueda y la TablaEstudiantes.
  - Si vista === 'formulario': muestra el formulario para registrar o editar.
  - Además, controla el flujo de confirmación al eliminar abriendo el modal ModalConfirmacion.
*/

import React, { useState, useMemo } from 'react';
import useEstudiantes from '../hooks/useEstudiantes';
import useCalificaciones from '../hooks/useCalificaciones';
import TablaEstudiantes from '../components/TablaEstudiantes';
import FormularioEstudiante from '../components/FormularioEstudiante';
import ModalConfirmacion from '../components/ModalConfirmacion';
import Loader from '../components/Loader';

export const EstudiantesPage = () => {
  // Obtenemos los datos y funciones globales del contexto de estudiantes
  const { 
    estudiantes, 
    cargando, 
    agregarEstudiante, 
    editarEstudiante, 
    eliminarEstudiante 
  } = useEstudiantes();

  // Obtenemos la utilidad de promedio del hook de calificaciones
  const { obtenerPromedioEstudiante } = useCalificaciones();

  // Estados locales para controlar la UI
  const [vista, setVista] = useState('tabla'); // 'tabla' | 'formulario'
  const [estudianteAEditar, setEstudianteAEditar] = useState(null); // estudiante que se está editando (null si es creación)
  const [terminoBusqueda, setTerminoBusqueda] = useState(''); // Filtro del buscador

  // Estados para el Modal de Confirmación
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [idEstudianteAEliminar, setIdEstudianteAEliminar] = useState(null);

  // Filtramos la lista de estudiantes según la búsqueda ingresada (Memoizado por rendimiento)
  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter(e => {
      const termino = terminoBusqueda.toLowerCase().trim();
      return (
        e.nombre.toLowerCase().includes(termino) ||
        e.email.toLowerCase().includes(termino) ||
        e.matricula.toLowerCase().includes(termino)
      );
    });
  }, [estudiantes, terminoBusqueda]);

  // --- MANEJADORES DE VISTAS ---
  
  const abrirFormularioCrear = () => {
    setEstudianteAEditar(null);
    setVista('formulario');
  };

  const abrirFormularioEditar = (estudiante) => {
    setEstudianteAEditar(estudiante);
    setVista('formulario');
  };

  const cancelarFormulario = () => {
    setVista('tabla');
    setEstudianteAEditar(null);
  };

  // --- OPERACIONES DE PERSISTENCIA ---

  /**
   * Guarda los datos del estudiante (creación o modificación).
   */
  const guardarDatosEstudiante = async (datos) => {
    let exito = false;
    
    if (estudianteAEditar) {
      // Modo Edición
      exito = await editarEstudiante(estudianteAEditar.id, datos);
    } else {
      // Modo Registro Nuevo
      exito = await agregarEstudiante(datos);
    }

    if (exito) {
      setVista('tabla');
      setEstudianteAEditar(null);
    }
  };

  // --- OPERACIÓN ELIMINAR ---

  const solicitarEliminacion = (id) => {
    setIdEstudianteAEliminar(id);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    if (idEstudianteAEliminar) {
      const exito = await eliminarEstudiante(idEstudianteAEliminar);
      if (exito) {
        console.log('Estudiante eliminado.');
      }
    }
    // Cerramos el modal y limpiamos el estado
    setMostrarModalEliminar(false);
    setIdEstudianteAEliminar(null);
  };

  const cancelarEliminacion = () => {
    setMostrarModalEliminar(false);
    setIdEstudianteAEliminar(null);
  };

  // Buscar el nombre del estudiante a eliminar para mostrarlo en el modal
  const obtenerNombreEstudianteAEliminar = () => {
    const est = estudiantes.find(e => e.id === idEstudianteAEliminar);
    return est ? est.nombre : '';
  };

  return (
    <div className="contenedor desvanecer-entrada">
      {/* Si el contexto global está cargando y estamos en tabla, mostramos loader */}
      {cargando && vista === 'tabla' && <Loader mensaje="Actualizando registros..." pantallaCompleta={true} />}

      {/* Renderizado Condicional de la Vista */}
      {vista === 'tabla' ? (
        <>
          {/* Barra de cabecera con acciones */}
          <div className="estudiantes-cabecera">
            <h2 className="dashboard-titulo">Gestión de Estudiantes</h2>
            <button 
              className="btn btn-primario" 
              onClick={abrirFormularioCrear}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Nuevo Estudiante
            </button>
          </div>

          {/* Buscador y estadísticas rápidas */}
          <div className="estudiantes-acciones-tabla">
            <div className="buscador-contenedor">
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
                style={{ color: 'var(--color-texto-debil)' }}
              >
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="buscador-input"
                placeholder="Buscar por nombre, email o matrícula..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>
            
            <span style={{ fontSize: '0.875rem', color: 'var(--color-texto-secundario)' }}>
              Mostrando <strong>{estudiantesFiltrados.length}</strong> de {estudiantes.length} alumnos
            </span>
          </div>

          {/* Tabla de Resultados */}
          <TablaEstudiantes
            estudiantes={estudiantesFiltrados}
            onEditar={abrirFormularioEditar}
            onEliminar={solicitarEliminacion}
            obtenerPromedio={obtenerPromedioEstudiante}
          />
        </>
      ) : (
        /* Vista de Formulario (Crear/Editar) */
        <FormularioEstudiante
          estudiante={estudianteAEditar}
          onGuardar={guardarDatosEstudiante}
          onCancelar={cancelarFormulario}
        />
      )}

      {/* Modal de Confirmación para borrar */}
      <ModalConfirmacion
        mostrar={mostrarModalEliminar}
        titulo="Eliminar Estudiante"
        mensaje={`¿Estás seguro de que deseas eliminar permanentemente al estudiante "${obtenerNombreEstudianteAEliminar()}"? Se borrarán también todas sus calificaciones.`}
        onConfirmar={confirmarEliminacion}
        onCancelar={cancelarEliminacion}
      />
    </div>
  );
};

export default EstudiantesPage;
