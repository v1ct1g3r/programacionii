/*
  ModalConfirmacion.jsx
  Componente modal para confirmación de acciones destructivas o críticas (como borrar un estudiante).
  
  PROPS:
  - mostrar (boolean): Controla la visibilidad del modal.
  - titulo (string): Título superior del cuadro.
  - mensaje (string): Texto de advertencia en el cuerpo del modal.
  - onConfirmar (function): Callback que se ejecuta cuando el usuario presiona "Confirmar".
  - onCancelar (function): Callback que se ejecuta al presionar "Cancelar" o cerrar el modal.
*/

import React from 'react';

export const ModalConfirmacion = ({ 
  mostrar, 
  titulo = '¿Estás seguro?', 
  mensaje = 'Esta acción no se puede deshacer.', 
  onConfirmar, 
  onCancelar 
}) => {
  // Si 'mostrar' es falso, no renderizamos absolutamente nada
  if (!mostrar) return null;

  return (
    <div className="modal-backdrop" onClick={onCancelar}>
      {/* 
        onClick={onCancelar} en el backdrop cierra el modal al hacer clic afuera.
        Usamos e.stopPropagation() en la tarjeta para evitar que al hacer clic dentro de ella
        también se cierre accidentalmente.
      */}
      <div className="modal-tarjeta" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">
          {/* Icono de advertencia en formato SVG */}
          <div className="modal-icono-alerta">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 className="modal-titulo">{titulo}</h3>
        </div>

        <div className="modal-cuerpo">
          <p>{mensaje}</p>
        </div>

        <div className="modal-acciones">
          <button 
            type="button" 
            className="btn btn-secundario" 
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn btn-peligro" 
            onClick={onConfirmar}
          >
            Confirmar y Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
