import { getPersonas } from './getPersonas.js'

export function findBiggestCod () {
  return getPersonas().then(personas => {
    if (personas) {
      return fetchCods(personas)
    }
  })
}

function fetchCods (personas) {
  let mayorCod = 0
  for (const persona of personas) {
    if (persona.cod > mayorCod) {
      mayorCod = persona.cod
    }
  }
  return mayorCod + 1
}
