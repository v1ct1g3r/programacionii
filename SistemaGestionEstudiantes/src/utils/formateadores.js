/*
  formateadores.js
  Funciones auxiliares utilitarias para formatear datos en la interfaz.
  
  EXPLICACIÓN PARA PRINCIPIANTES:
  Las funciones utilitarias o helpers son herramientas independientes que realizan tareas repetitivas
  (como redondear números o formatear fechas) para no tener que duplicar ese código dentro de los componentes.
*/

/**
 * Formatea un promedio decimal con un decimal, manejando valores nulos.
 * @param {number|string} valor - El número de promedio a formatear
 * @returns {string} Promedio formateado (ej: "8.5") o "N/A"
 */
export const formatearPromedio = (valor) => {
  const numero = parseFloat(valor);
  if (isNaN(numero) || numero === 0) return 'N/A';
  return numero.toFixed(1);
};

/**
 * Formatea una fecha estándar en un formato amigable para el usuario.
 * @param {Date|string} fecha - La fecha a formatear
 * @returns {string} Fecha en formato corto (ej: "29 de junio, 2026")
 */
export const formatearFechaCorta = (fecha) => {
  if (!fecha) return '';
  const objFecha = new Date(fecha);
  return objFecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
