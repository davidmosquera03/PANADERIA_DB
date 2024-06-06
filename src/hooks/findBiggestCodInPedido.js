import { getWhatever } from './getWhatever.js'

export default async function findBiggestCodInPedido () {
  return getWhatever('http://127.0.0.1:8000/polls/api/v1/pedidos/')
    .then(pedidos => {
      if (pedidos) {
        return fetchCods(pedidos)
      }
    })
}

function fetchCods (pedidos) {
  let mayorCod = 0
  for (const pedido of pedidos) {
    if (pedido.cod > mayorCod) {
      mayorCod = pedido.cod
    }
  }
  return mayorCod + 1
}
