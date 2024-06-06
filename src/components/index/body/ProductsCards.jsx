import React, { useState, useEffect } from 'react'
import { getWhatever } from '../../../hooks/getWhatever.js'
import getAmountOfProduct from '../../../hooks/getAmountOfProduct.js'

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
  }

  const handleDecrement = (nombre) => {
    if (cantidadProductos[nombre] > 0) {
      setCantidadProductos((prevCantidadProductos) => {
        const updatedCantidadProductos = {
          ...prevCantidadProductos,
          [nombre]: prevCantidadProductos[nombre] - 1
        }

        // Eliminar el producto del objeto si la cantidad es 0
        if (updatedCantidadProductos[nombre] === 0) {
          delete updatedCantidadProductos[nombre]
        }

        return updatedCantidadProductos
      })
    }
  }

  useEffect(() => {
    let totalPrice = 0
    productos.forEach((producto) => {
      totalPrice += (cantidadProductos[producto.nombre] || 0) * producto.precio
    })
    setTotal(parseFloat(totalPrice.toFixed(2)))
  }, [cantidadProductos, productos])

  const payForAll = (cantidadProductos) => {
    // Crear un arreglo con los productos seleccionados
    const productosSeleccionados = Object.keys(cantidadProductos).map((nombre) => {
      const producto = productos.find((prod) => prod.nombre === nombre)
      return {
        nombre,
        codigo: producto.cod,
        cantidad: cantidadProductos[nombre]
      }
    })
    const totalAmount = total // Guardar el total en una variable aparte
    localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados))
    localStorage.setItem('total', totalAmount)

    window.location.href = 'pago.html'
  }

  const hasSelectedProducts = Object.values(cantidadProductos).some((cantidad) => cantidad > 0)

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
      <div className="total-flex">
        <div className="selected-products">
          <h3>Productos Seleccionados</h3>
          <ul>
            {Object.keys(cantidadProductos).map((nombreProducto) => (
              <li key={nombreProducto}>
                {nombreProducto}: {cantidadProductos[nombreProducto]} (
                {(
                  cantidadProductos[nombreProducto] *
                  productos.find((prod) => prod.nombre === nombreProducto).precio
                ).toFixed(2)}
                )
              </li>
            ))}
          </ul>
        </div>
        <div className="total-container">
          <h3>Total</h3>
          <p>${total}</p>
        </div>
      </div>
      {hasSelectedProducts && (
        <button onClick={() => payForAll(cantidadProductos)}>Continuar con el Pago</button>
      )}
    </div>
  )
}
