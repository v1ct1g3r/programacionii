/*
  FormularioEstudiante.jsx
  Componente de formulario para crear o editar un estudiante.
  
  PROPS:
  - estudiante (object|null): Si se pasa un estudiante, el formulario estará en modo edición 
    y se precargarán sus datos. Si es null, estará en modo creación.
  - onGuardar (function): Callback que procesa el guardado de los datos.
  - onCancelar (function): Callback para cerrar el formulario sin guardar.
*/

import React, { useState, useEffect } from 'react';

export const FormularioEstudiante = ({ estudiante, onGuardar, onCancelar }) => {
  // Estado para las entradas del formulario (Inputs)
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  // Estado para capturar errores de validación de entradas
  const [errores, setErrores] = useState({});

  // Carga los datos del estudiante si estamos en modo edición
  useEffect(() => {
    if (estudiante) {
      setNombre(estudiante.nombre || '');
      setEmail(estudiante.email || '');
      setTelefono(estudiante.telefono || '');
    } else {
      // Si cambia a null (crear nuevo), limpiamos los campos
      setNombre('');
      setEmail('');
      setTelefono('');
    }
  }, [estudiante]);

  /**
   * Realiza la validación de los campos antes de enviar el formulario.
   */
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es requerido.';
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!email.trim()) {
      nuevosErrores.email = 'El correo electrónico es requerido.';
    } else {
      // Expresión regular sencilla para validar email
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email)) {
        nuevosErrores.email = 'El correo electrónico no es válido.';
      }
    }

    setErrores(nuevosErrores);
    // Si el objeto nuevosErrores no tiene claves, el formulario es válido
    return Object.keys(nuevosErrores).length === 0;
  };

  /**
   * Manejador del envío (submit) del formulario.
   */
  const manejarEnvio = (evento) => {
    // Evitamos que la página se recargue (comportamiento por defecto de HTML)
    evento.preventDefault();

    if (validarFormulario()) {
      // Pasamos los datos recolectados al componente padre
      onGuardar({
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim()
      });
    }
  };

  return (
    <div className="seccion-dashboard desvanecer-entrada" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 className="seccion-dashboard-titulo">
        {estudiante ? 'Modificar Estudiante' : 'Registrar Nuevo Estudiante'}
      </h3>
      
      <form onSubmit={manejarEnvio} noValidate>
        {/* Campo de Nombre */}
        <div className="grupo-formulario">
          <label htmlFor="nombre">Nombre Completo *</label>
          <input
            id="nombre"
            type="text"
            className={`input-control ${errores.nombre ? 'input-error' : ''}`}
            placeholder="Ej. Juan Pérez Gómez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {errores.nombre && <span className="error-formulario">{errores.nombre}</span>}
        </div>

        {/* Campo de Correo */}
        <div className="grupo-formulario">
          <label htmlFor="email">Correo Electrónico *</label>
          <input
            id="email"
            type="email"
            className={`input-control ${errores.email ? 'input-error' : ''}`}
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errores.email && <span className="error-formulario">{errores.email}</span>}
        </div>

        {/* Campo de Teléfono */}
        <div className="grupo-formulario">
          <label htmlFor="telefono">Teléfono de Contacto</label>
          <input
            id="telefono"
            type="tel"
            className="input-control"
            placeholder="Ej. 555-0199"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-texto-secundario)', marginBottom: '1.5rem' }}>
          * Los campos marcados con asterisco son obligatorios.
        </p>

        {/* Acciones del Formulario */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secundario"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primario"
          >
            {estudiante ? 'Guardar Cambios' : 'Registrar Estudiante'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEstudiante;
