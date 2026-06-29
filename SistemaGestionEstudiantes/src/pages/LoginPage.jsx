/*
  LoginPage.jsx
  Pantalla de inicio de sesión de la aplicación.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Esta es la primera vista que verá un usuario no autenticado.
  Captura el email y la contraseña usando inputs controlados (con useState)
  y, al hacer submit, invoca la función `iniciarSesion` expuesta por `useAuth`.
*/

import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const LoginPage = () => {
  const { iniciarSesion, errorAuth, cargando } = useAuth();
  
  // Estados locales para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado local para validación rápida del lado del cliente
  const [errorLocal, setErrorLocal] = useState('');

  /**
   * Maneja el evento de envío del formulario de login.
   */
  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    setErrorLocal('');

    // Validamos que los campos no estén vacíos
    if (!email.trim() || !password.trim()) {
      setErrorLocal('Por favor, complete todos los campos.');
      return;
    }

    // Llamamos a iniciarSesion del AuthContext
    const exito = await iniciarSesion(email.trim(), password);
    
    if (exito) {
      console.log('Sesión iniciada con éxito');
      // No necesitamos redirigir manualmente aquí. Al cambiar el estado de 'usuario' 
      // en AuthContext, App.jsx re-renderizará mostrando automáticamente el Dashboard.
    }
  };

  return (
    <div className="login-contenedor">
      <div className="login-tarjeta desvanecer-entrada">
        {/* Cabecera con Logo */}
        <div className="login-cabecera">
          <div className="login-marca-icono">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"/>
              <path d="M3.82001 11.53V16.73L12 21.2L20.18 16.73V11.53L12 16L3.82001 11.53Z" opacity="0.8"/>
            </svg>
          </div>
          <h2 className="login-titulo">Control Docente</h2>
          <p className="login-subtitulo">Ingrese sus credenciales para acceder al sistema</p>
        </div>

        {/* Alertas de error (local o del servidor simulado) */}
        {(errorLocal || errorAuth) && (
          <div className="login-error-alerta">
            {errorLocal || errorAuth}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Campo Email */}
          <div className="grupo-formulario">
            <label htmlFor="login-email">Correo Institucional</label>
            <input
              id="login-email"
              type="email"
              className="input-control"
              placeholder="ejemplo@colegio.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={cargando}
            />
          </div>

          {/* Campo Password */}
          <div className="grupo-formulario">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              className="input-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
            />
          </div>

          {/* Botón de envío */}
          <button 
            type="submit" 
            className="btn btn-primario" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={cargando}
          >
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Credenciales de demostración para facilitar la prueba al docente */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--color-primario-claro)', borderRadius: 'var(--radio-sm)', fontSize: '0.75rem', color: 'var(--color-texto-secundario)', textAlign: 'left' }}>
          <strong>Credenciales de Prueba:</strong>
          <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
            <li>Usuario: <code style={{ color: 'var(--color-primario)' }}>profesor@colegio.edu</code></li>
            <li>Contraseña: <code style={{ color: 'var(--color-primario)' }}>admin123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
