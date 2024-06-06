import { useEffect, useState } from 'react'
import { getDirecciones } from '../../hooks/getDirrecciones.js'
import { getWhatever } from '../../hooks/getWhatever.js'
import createOrder from '../../hooks/createOrder.js'
import createNewDireccion from '../../hooks/createNewDireccion.js'

export default function PagoPage () {
  const productos = JSON.parse(localStorage.getItem('productosSeleccionados')) || []
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('loggedInUser')))
  const [direcciones, setDirecciones] = useState([])
  const [opcionEntrega, setOpcionEntrega] = useState('Recoger')
  const [nuevaDireccion, setNuevaDireccion] = useState('')
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('')
  const [pagoValido, setPagoValido] = useState(false) // Estado para validar si se puede realizar el pago
  const [estadoPedido, setEstadoPedido] = useState('') // Estado para almacenar el mensaje del estado del pedido
  const [codDireccion, setCodDireccion] = useState('') // Estado para almacenar el código de la dirección [cod_direccion

  const total = localStorage.getItem('total')
  const totalFloat = parseFloat(total)

  useEffect(() => {
    if (opcionEntrega === 'Domicilio') {
      getDirecciones(user.cod)
        .then(direcciones => setDirecciones(direcciones))
        .catch(error => console.error('Error obteniendo direcciones:', error))
    } else {
      setPagoValido(true) // Si la opción de entrega es recoger, el pago es válido
    }
  }, [opcionEntrega, user.cod])

  const handleOpcionEntregaChange = (event) => {
    setOpcionEntrega(event.target.value)
    setDireccionSeleccionada('') // Limpiar la dirección seleccionada al cambiar la opción de entrega
    setNuevaDireccion('') // Limpiar la nueva dirección al cambiar la opción de entrega
  }

  const handleNuevaDireccionChange = (event) => {
    setNuevaDireccion(event.target.value)
  }

  const handleDireccionSeleccionadaChange = (event) => {
    setDireccionSeleccionada(event.target.value)
  }

  const handlePagar = () => {
    let direccionPago = ''

    if (opcionEntrega === 'Recoger') {
      setPagoValido(true)
    } else if (direccionSeleccionada !== '') {
      console.log(direccionSeleccionada)
      console.log(direcciones)

      direccionPago = direcciones.find(direccion => parseInt(direccion.id) === parseInt(direccionSeleccionada)).dir

      setPagoValido(true)
    } else if (nuevaDireccion !== '') {
      direccionPago = nuevaDireccion
      createNewDireccion(nuevaDireccion, user.cod)
      setPagoValido(true)
    } else {
      setPagoValido(false)
    }

    if (pagoValido && opcionEntrega !== 'Recoger') {
      setCodDireccion(createOrder(direccionPago, user.cod, productos))
      setEstadoPedido('Su pedido esta en estado Por enviar') // Actualizar el estado del pedido
    }
  }

  const handleActualizar = async () => {
    try {
      // Espera a que la promesa de getWhatever se resuelva
      const direcciones = await getWhatever('http://127.0.0.1:8000/polls/api/v1/pedidos/')

      if (direcciones) {
        // Espera a que la promesa de codDireccion se resuelva
        const codDireccionValue = await codDireccion

        // Encuentra el pedido usando el valor resuelto de codDireccion
        const pedido = direcciones.find(pedido => parseInt(pedido.cod) === parseInt(codDireccionValue))

        if (pedido) {
          setEstadoPedido(`Su pedido está en estado ${pedido.estado}`)
        }
      }
    } catch (error) {
      console.error('Error al obtener el pedido:', error)
      setEstadoPedido('Error al actualizar el estado del pedido. Inténtelo de nuevo.')
    }
  }

  return (
<div class="pago-page">
  <h2>Productos Seleccionados</h2>
  <ul class="productos-lista">
    {productos.map((producto, index) => (
      <li key={index} class="producto-item">
        {producto.nombre}: {producto.cantidad}
      </li>
    ))}
  </ul>
  <h3 class="total-pagar">Valor a pagar: {totalFloat}</h3>

  <div class="opciones-entrega">
    <label htmlFor="opcionEntrega" class="opcion-label">Opciones de Entrega: </label>
    <select id="opcionEntrega" value={opcionEntrega} onChange={handleOpcionEntregaChange} class="opcion-select">
      <option value="Recoger">Recoger</option>
      <option value="Domicilio">Domicilio</option>
    </select>
  </div>
  {opcionEntrega === 'Domicilio' && (
    <div class="direccion-seleccion">
      <div class="select-direccion">
        <label htmlFor="direccion" class="direccion-label">Selecciona una dirección: </label>
        <select id="direccion" value={direccionSeleccionada} onChange={handleDireccionSeleccionadaChange} class="direccion-select">
          <option value="">Selecciona una dirección</option>
          {direcciones.map(direccion => (
            <option key={direccion.id} value={direccion.id} class="direccion-option">
              {direccion.dir}
            </option>
          ))}
        </select>
      </div>
      {!direccionSeleccionada && ( // Mostrar el campo de nueva dirección solo si no se ha seleccionado una dirección existente
        <div class="nueva-direccion">
          <label htmlFor="nuevaDireccion" class="nueva-direccion-label">Nueva Dirección: </label>
          <input type="text" id="nuevaDireccion" value={nuevaDireccion} onChange={handleNuevaDireccionChange} class="nueva-direccion-input" />
        </div>
      )}
    </div>
  )}
  <button onClick={handlePagar} disabled={!pagoValido} class="boton-pagar">Pagar</button>
  <p class="estado-pedido">{estadoPedido}</p>
  {estadoPedido && (
    <button onClick={() => handleActualizar()} class="boton-actualizar">Actualizar</button>
  )}
</div>

  )
}
