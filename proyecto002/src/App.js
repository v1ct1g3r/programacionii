import { useState, useEffect } from 'react';

function App() {

  const [usuario, setUsuario] = useState([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(r => r.json())
    .then(data => setUsuario(data));
    }, [])

  return (
    <div>
      <table border="5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {usuario.map(art => {
            return (
              <tr key={art.id}>
                <td>{art.name}</td>
                <td>{art.username}</td>
                <td>{art.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App