import { getWhatever } from './getWhatever.js'

export function findBiggestCod () {
  return getWhatever('http://127.0.0.1:8000/polls/api/v1/personas/').then(personas => {
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
