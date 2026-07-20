import { useState } from 'react'

// --- Imágenes importadas desde src/assets (empaquetadas por Vite) ---
import manzana from './assets/images/frutas/manzana.svg'
import banana from './assets/images/frutas/banana.svg'
import uva from './assets/images/frutas/uva.svg'

import laptop from './assets/images/electronica/laptop.svg'
import celular from './assets/images/electronica/celular.svg'
import audifonos from './assets/images/electronica/audifonos.svg'

import camisa from './assets/images/ropa/camisa.svg'
import pantalon from './assets/images/ropa/pantalon.svg'
import chaqueta from './assets/images/ropa/chaqueta.svg'

// --- Datos: cada categoría tiene su lista de productos ---
const catalogo = {
  Frutas: [
    { id: 'manzana', nombre: 'Manzana', precio: 25, img: manzana },
    { id: 'banana', nombre: 'Banana', precio: 15, img: banana },
    { id: 'uva', nombre: 'Uva', precio: 60, img: uva },
  ],
  Electronica: [
    { id: 'laptop', nombre: 'Laptop', precio: 25000, img: laptop },
    { id: 'celular', nombre: 'Celular', precio: 12000, img: celular },
    { id: 'audifonos', nombre: 'Audífonos', precio: 1500, img: audifonos },
  ],
  Ropa: [
    { id: 'camisa', nombre: 'Camisa', precio: 800, img: camisa },
    { id: 'pantalon', nombre: 'Pantalón', precio: 1200, img: pantalon },
    { id: 'chaqueta', nombre: 'Chaqueta', precio: 2500, img: chaqueta },
  ],
}

function App() {
  const [categoria, setCategoria] = useState('')
  const [productoId, setProductoId] = useState('')

  // Lista de productos disponibles según la categoría elegida
  const productosDisponibles = categoria ? catalogo[categoria] : []

  // Producto actualmente seleccionado (para mostrar detalle)
  const producto = productosDisponibles.find((p) => p.id === productoId)

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value)
    setProductoId('') // al cambiar la categoría, se resetea el producto
  }

  return (
    <div className="app">
      <header className="header">
        {/* Imagen cargada desde public/ (se referencia por ruta absoluta) */}
        <img src="/images/banner.svg" alt="El Mercadito" className="banner" />
      </header>

      <main className="contenido">
        <div className="intro">
          <span className="eyebrow">Paso 1 → Paso 2</span>
          <h1>Arma tu pedido</h1>
          <p>Elige una categoría y luego el producto. La segunda lista cambia según tu elección.</p>
        </div>

        <div className="selects">
          <div className="campo">
            <label htmlFor="categoria">01 · Categoría</label>
            <div className="select-wrap">
              <select id="categoria" value={categoria} onChange={handleCategoriaChange}>
                <option value="">Elige una categoría</option>
                {Object.keys(catalogo).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flecha" aria-hidden="true">→</div>

          <div className="campo">
            <label htmlFor="producto">02 · Producto</label>
            <div className="select-wrap">
              <select
                id="producto"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                disabled={!categoria}
              >
                <option value="">
                  {categoria ? 'Elige un producto' : 'Primero elige categoría'}
                </option>
                {productosDisponibles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="ticket-slot">
          {producto ? (
            <div className="ticket" key={producto.id}>
              <div className="ticket-hoyo"></div>
              {/* Imagen importada desde src/assets */}
              <img src={producto.img} alt={producto.nombre} className="ticket-img" />
              <div className="ticket-cuerpo">
                <span className="ticket-categoria">{categoria}</span>
                <h2>{producto.nombre}</h2>
                <span className="ticket-precio">RD$ {producto.precio.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="ticket-vacio">
              <p>Tu producto aparecerá aquí como una etiqueta de precio.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
