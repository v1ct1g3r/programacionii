import React, { useState } from 'react';

const FormularioValidado = () => {
  // 1. Enlazar cada control con una variable de estado (Hook useState)
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  // Estados adicionales para guardar los mensajes de error de cada campo
  const [errores, setErrores] = useState({
    nombre: '',
    correo: '',
    password: ''
  });

  // 2. Lógica de Validación Inmediata
  // Esta función se llama cada vez que el usuario escribe en el campo 'nombre'
  const handleNombreChange = (e) => {
    const valor = e.target.value;
    setNombre(valor); // Actualizamos el estado del input

    // Validamos inmediatamente
    if (valor.trim() === '') {
      setErrores((prev) => ({ ...prev, nombre: 'El nombre es obligatorio.' }));
    } else if (valor.length < 3) {
      setErrores((prev) => ({ ...prev, nombre: 'El nombre debe tener al menos 3 letras.' }));
    } else {
      // Si es válido, limpiamos el error
      setErrores((prev) => ({ ...prev, nombre: '' })); 
    }
  };

  const handleCorreoChange = (e) => {
    const valor = e.target.value;
    setCorreo(valor);

    // Expresión regular simple para validar formato de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(valor)) {
      setErrores((prev) => ({ ...prev, correo: 'Introduce un correo válido.' }));
    } else {
      setErrores((prev) => ({ ...prev, correo: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const valor = e.target.value;
    setPassword(valor);

    if (valor.length < 6) {
      setErrores((prev) => ({ ...prev, password: 'La contraseña debe tener al menos 6 caracteres.' }));
    } else {
      setErrores((prev) => ({ ...prev, password: '' }));
    }
  };

  // 3. Determinar si el formulario es válido para deshabilitar el botón
  // Un formulario es válido si no hay mensajes de error Y los campos no están vacíos.
  const isFormValid = 
    nombre !== '' && 
    correo !== '' && 
    password !== '' &&
    errores.nombre === '' && 
    errores.correo === '' && 
    errores.password === '';

  // Función para manejar el envío (Submit)
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    alert('Formulario enviado con éxito!');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Campo: Nombre */}
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre:</label><br />
          <input 
            type="text" 
            value={nombre} 
            onChange={handleNombreChange} 
            placeholder="Tu nombre"
          />
          {/* Mostrar error si existe */}
          {errores.nombre && <p style={{ color: 'red', margin: '5px 0 0' }}>{errores.nombre}</p>}
        </div>

        {/* Campo: Correo */}
        <div style={{ marginBottom: '15px' }}>
          <label>Correo Electrónico:</label><br />
          <input 
            type="email" 
            value={correo} 
            onChange={handleCorreoChange} 
            placeholder="ejemplo@correo.com"
          />
          {errores.correo && <p style={{ color: 'red', margin: '5px 0 0' }}>{errores.correo}</p>}
        </div>

        {/* Campo: Contraseña */}
        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label><br />
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            placeholder="Mínimo 6 caracteres"
          />
          {errores.password && <p style={{ color: 'red', margin: '5px 0 0' }}>{errores.password}</p>}
        </div>

        {/* 4. Deshabilitar el botón de envío hasta que el formulario sea válido */}
        <button 
          type="submit" 
          disabled={!isFormValid}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isFormValid ? '#4CAF50' : '#ccc',
            color: 'white',
            cursor: isFormValid ? 'pointer' : 'not-allowed'
          }}
        >
          Enviar Formulario
        </button>
      </form>
    </div>
  );
};

export default FormularioValidado;