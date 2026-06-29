/*
  PerfilPage.jsx
  Página de perfil del docente autenticado.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Muestra la información de la sesión activa del profesor.
  Permite al docente modificar sus datos básicos (como nombre y correo electrónico)
  mediante un formulario con estados locales. Al guardar, actualiza el AuthContext 
  llamando a `actualizarPerfil`, lo que actualiza de inmediato el Navbar y los datos de sesión.
*/

import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const PerfilPage = () => {
  const { usuario, actualizarPerfil } = useAuth();

  // Estados locales para los campos editables del perfil
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [departamento, setDepartamento] = useState(usuario?.departamento || 'Departamento de Ciencias y Tecnología');
  
  // Estado de contraseña simulado
  const [password, setPassword] = useState('');

  // Estados para retroalimentación
  const [errorLocal, setErrorLocal] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);

  // Obtener iniciales para la foto de perfil simulada
  const obtenerIniciales = (nombreDocente) => {
    if (!nombreDocente) return 'P';
    const partes = nombreDocente.split(' ');
    if (partes.length > 1) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombreDocente[0].toUpperCase();
  };

  /**
   * Manejador del envío del formulario para actualizar perfil.
   */
  const manejarGuardarPerfil = (e) => {
    e.preventDefault();
    setErrorLocal('');
    setMensajeExito('');

    // Validaciones básicas
    if (!nombre.trim() || !email.trim()) {
      setErrorLocal('El nombre y el correo electrónico son obligatorios.');
      return;
    }

    setCargando(true);

    // Simulamos un breve delay de procesamiento
    setTimeout(() => {
      const datosActualizados = {
        nombre: nombre.trim(),
        email: email.trim(),
        departamento: departamento.trim()
      };

      // Si ingresó una nueva contraseña, la actualizamos también en la simulación
      if (password.trim() !== '') {
        if (password.length < 6) {
          setErrorLocal('La nueva contraseña debe tener al menos 6 caracteres.');
          setCargando(false);
          return;
        }
        datosActualizados.password = password;
      }

      // Llamamos a la función del contexto global
      const exito = actualizarPerfil(datosActualizados);

      if (exito) {
        setMensajeExito('¡Perfil actualizado con éxito!');
        setPassword(''); // Limpiamos el campo de contraseña
      } else {
        setErrorLocal('Error al intentar guardar los cambios.');
      }
      setCargando(false);
    }, 400);
  };

  return (
    <div className="contenedor desvanecer-entrada">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="dashboard-titulo">Mi Perfil Profesional</h2>
        <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
          Consulte su información institucional o actualice sus datos de contacto y contraseña.
        </p>
      </div>

      <div className="perfil-grid">
        {/* LADO IZQUIERDO: Tarjeta de Resumen Visual */}
        <div className="perfil-tarjeta-lateral">
          <div className="perfil-foto-circulo">
            {obtenerIniciales(usuario?.nombre)}
          </div>
          <div>
            <h3 className="perfil-tarjeta-lateral-nombre">{usuario?.nombre}</h3>
            <span className="perfil-tarjeta-lateral-rol">{usuario?.rol}</span>
          </div>

          <div className="perfil-detalles-lista">
            <div className="perfil-detalle-item">
              <span className="perfil-detalle-etiqueta">ID Docente:</span>
              <span className="perfil-detalle-valor">DOC-2026-089</span>
            </div>
            <div className="perfil-detalle-item">
              <span className="perfil-detalle-etiqueta">Institución:</span>
              <span className="perfil-detalle-valor">San Agustín</span>
            </div>
            <div className="perfil-detalle-item">
              <span className="perfil-detalle-etiqueta">Campus:</span>
              <span className="perfil-detalle-valor">Principal</span>
            </div>
            <div className="perfil-detalle-item">
              <span className="perfil-detalle-etiqueta">Estado:</span>
              <span className="perfil-detalle-valor" style={{ color: 'var(--color-exito)' }}>Activo</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Formulario de Modificación */}
        <div className="seccion-dashboard">
          <h3 className="seccion-dashboard-titulo">Editar Información del Perfil</h3>

          {/* Alertas */}
          {errorLocal && (
            <div className="login-error-alerta" style={{ marginBottom: '1.5rem' }}>
              {errorLocal}
            </div>
          )}

          {mensajeExito && (
            <div 
              style={{ 
                backgroundColor: 'var(--color-exito-claro)', 
                border: '1px solid #a7f3d0', 
                color: 'var(--color-exito)', 
                padding: '0.75rem', 
                borderRadius: 'var(--radio-sm)', 
                fontSize: '0.875rem', 
                marginBottom: '1.5rem' 
              }}
            >
              {mensajeExito}
            </div>
          )}

          <form onSubmit={manejarGuardarPerfil}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Campo Nombre */}
              <div className="grupo-formulario">
                <label htmlFor="perfil-nombre">Nombre Completo *</label>
                <input
                  id="perfil-nombre"
                  type="text"
                  className="input-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={cargando}
                />
              </div>

              {/* Campo Email */}
              <div className="grupo-formulario">
                <label htmlFor="perfil-email">Correo Institucional *</label>
                <input
                  id="perfil-email"
                  type="email"
                  className="input-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={cargando}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              {/* Campo Departamento */}
              <div className="grupo-formulario">
                <label htmlFor="perfil-departamento">Departamento Académico</label>
                <input
                  id="perfil-departamento"
                  type="text"
                  className="input-control"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  disabled={cargando}
                />
              </div>

              {/* Campo Contraseña Simulada */}
              <div className="grupo-formulario">
                <label htmlFor="perfil-password">Nueva Contraseña (Opcional)</label>
                <input
                  id="perfil-password"
                  type="password"
                  className="input-control"
                  placeholder="Dejar en blanco para conservar"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={cargando}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--color-borde)', paddingTop: '1.25rem' }}>
              <button
                type="submit"
                className="btn btn-primario"
                disabled={cargando}
              >
                {cargando ? 'Guardando Cambios...' : 'Guardar Información'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
