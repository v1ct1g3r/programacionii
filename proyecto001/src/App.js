import { useState } from "react";

const vecLen = 10;

function App() {
  function generarAleatorios() {
    const vec = new Array(vecLen);
    for (let i = 0; i < vecLen; i++)
      vec[i] = Math.trunc(Math.random() * 10);
    setNumbers(vec);
  }
  const [numbers, setNumbers] = useState(new Array(vecLen).fill(0));
  return (
    <div>
      <p>Numeros aleatorios:</p>
      {numbers.map(num => (<p>{num}</p>))}
      <button onClick={generarAleatorios}>Generar Numeros Aleatorios</button>
    </div>
  );
}

export default App;
