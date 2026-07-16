import { useState, useEffect } from 'react';

function App() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    fetch("http://localhost:5001/usuarios")
      .then((response) => {
        return response.json()
      })
      .then((usuarios) => {
        setUsuarios(usuarios)
      })
  }, [])

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>id</th>
            <th>nombre</th>
            <th>apellido</th>
            <th>correo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(art => {
            return (
              <tr key={art.id}>
                <td>{art.id}</td>
                <td>{art.nombre}</td>
                <td>{art.apellido}</td>
                <td>{art.correo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default App