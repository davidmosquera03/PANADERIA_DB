import { getWhatever } from './getWhatever'

export async function getDirecciones (codUser) {
  try {
    const url = 'http://127.0.0.1:8000/polls/api/v1/direcciones/'
    const direcciones = await getWhatever(url)

    // Filtrar todas las direcciones correspondientes al codUser
    const direccionesUsuario = direcciones.filter(direccion => direccion.cod_per === codUser)

    return direccionesUsuario
  } catch (error) {
    console.error('Error al obtener las direcciones:', error)
    throw error
  }
}
