import { getWhatever } from './getWhatever'

export default async function getAmountOfProduct (cod, amount) {
  const response = await getWhatever('http://127.0.0.1:8000/polls/api/v1/productos/')
  const producto = response.find((producto) => producto.cod === cod)
  const cantidad = parseInt(producto.cat)

  if (cantidad < amount) {
    console.log('No Hay suficiente producto en stock')
    return false
  }
  return true
}
