import React, { useState, useEffect } from 'react'
import { getWhatever } from '../../../hooks/getWhatever.js'
import getAmountOfProduct from '../../../hooks/getAmountOfProduct.js'
import payForAll from '../../../hooks/payForAll.js'

export default function ProductsCards () {
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [cantidadProductos, setCantidadProductos] = useState({})

  useEffect(() => {
    async function fetchProductos () {
      try {
        const response = await getWhatever('http://127.0.0.1:8000/polls/api/v1/productos/')
        setProductos(response)
      } catch (error) {
        console.error('Error fetching productos', error)
      }
    }
    fetchProductos()
  }, [])

  const handleIncrement = (producto) => {
    setCantidadProductos((prevCantidadProductos) => ({
      ...prevCantidadProductos,
      [producto.nombre]: (prevCantidadProductos[producto.nombre] || 0) + 1
    }))

      .catch((error) => {
        // Manejar errores si ocurren
        console.error(error)
      })
  }

  const handleDecrement = (nombre) => {
    if (cantidadProductos[nombre] > 0) {
      setCantidadProductos((prevCantidadProductos) => ({
        ...prevCantidadProductos,
        [nombre]: prevCantidadProductos[nombre] - 1
      }))
    }
  }

  const carrito = (productos) => {

  }

  useEffect(() => {
    let totalPrice = 0
    productos.forEach((producto) => {
      totalPrice += (cantidadProductos[producto.nombre] || 0) * producto.precio
    })
    // Redondear el total a 2 decimales
    setTotal(parseFloat(totalPrice.toFixed(2)))
  }, [cantidadProductos, productos])

  return (
    <div className="products-container">
      <h2>Productos</h2>
      <div className="products-list">
        {productos.map((producto) => (
          <div key={producto.cod} className="product-card">
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <div>
              <button onClick={() => handleIncrement(producto)}>+</button>
              <button onClick={() => handleDecrement(producto.nombre)}>-</button>
            </div>
            <p>Cantidad seleccionada: {cantidadProductos[producto.nombre] || 0}</p>
          </div>
        ))}
      </div>
      <div className='total-flex'>
        <div className="selected-products">
          <h3>Productos Seleccionados</h3>
          <ul>
            {Object.keys(cantidadProductos).map((nombreProducto) => (
              <li key={nombreProducto}>
                {nombreProducto}: {cantidadProductos[nombreProducto]} (
                {(cantidadProductos[nombreProducto] * productos.find((prod) => prod.nombre === nombreProducto).precio).toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
        <div className="total-container">
          <h3>Total</h3>
          <p>${total}</p>
        </div>
        </div>

        <button>Continuar con el Pago</button>
    </div>
  )
}
