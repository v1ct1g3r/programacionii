import { useState } from 'react';

function FormularioPractica() {
  const [comentario, setComentario] = useState('');
  const [opcionSelect, setOpcionSelect] = useState('');
  const [opcionRadio, setOpcionRadio] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', {
      comentario,
      opcionSelect,
      opcionRadio
    });
    alert('Formulario enviado. Revisa la consola para ver los datos.');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Práctica Semana 10</h2>

      <form onSubmit={handleSubmit}>

        {/* --- CONTROL 1: TEXTAREA --- */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="comentario" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Comentario (Textarea):
          </label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="Escribe tu comentario aquí..."
          />
        </div>

        {/* --- CONTROL 2: SELECT --- */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="opciones" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Categoría (Select):
          </label>
          <select
            id="opciones"
            value={opcionSelect}
            onChange={(e) => setOpcionSelect(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">-- Selecciona una opción --</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Base de Datos</option>
          </select>
        </div>

        {/* --- CONTROL 3: GRUPO DE RADIO --- */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Nivel de dificultad (Radio):
          </span>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <label>
              <input
                type="radio"
                name="dificultad"
                value="basico"
                checked={opcionRadio === 'basico'}
                onChange={(e) => setOpcionRadio(e.target.value)}
              />
              {' '}Básico
            </label>

            <label>
              <input
                type="radio"
                name="dificultad"
                value="intermedio"
                checked={opcionRadio === 'intermedio'}
                onChange={(e) => setOpcionRadio(e.target.value)}
              />
              {' '}Intermedio
            </label>

            <label>
              <input
                type="radio"
                name="dificultad"
                value="avanzado"
                checked={opcionRadio === 'avanzado'}
                onChange={(e) => setOpcionRadio(e.target.value)}
              />
              {' '}Avanzado
            </label>
          </div>
        </div>

        {/* BOTÓN DE ENVÍO */}
        <button
          type="submit"
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Enviar Datos
        </button>
      </form>
    </div>
  );
}

export default FormularioPractica;