import findBiggestCodInPedido from './findBiggestCodInPedido.js'

export default async function createOrder (dir_pedido, cod_cliente, productos) {
  const url = 'http://127.0.0.1:8000/polls/api/v1/pedidos/'
  const cod = await findBiggestCodInPedido()
  const tipo = 'Domicilio'
  const estado = 'Por enviar'
  console.log('Productos:', productos)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cod,
        dir_pedido,
        tipo,
        estado,
        cod_cliente
      })
    })

    if (response.ok) {
      await insertProducts(productos, cod)
    } else {
      console.error('Failed to register order')
    }
  } catch (error) {
    console.error('An error occurred while registering order:', error)
  }
  return cod
}

async function insertProducts (prods, cod_pedido) {
  const url = 'http://127.0.0.1:8000/polls/api/v1/detalles/'

  try {
    for (const prod of prods) {
      const { cantidad, codigo } = prod
      const cod_producto = parseInt(codigo)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cantidad,
          cod_pedido,
          cod_producto
        })
      })

      if (response.ok) {
        console.log(`Product ${codigo} inserted successfully`)
      } else {
        console.error(`Failed to insert product ${codigo}`)
      }
    }
  } catch (error) {
    console.error('An error occurred while inserting products:', error)
  }
}
