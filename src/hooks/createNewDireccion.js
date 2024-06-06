import { getDirecciones } from './getDirrecciones'

export default async function createNewDireccion (dir, cod_per) {
  const url = 'http://127.0.0.1:8000/polls/api/v1/direcciones/'
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dir,
        cod_per
      })
    })

    if (response.ok) {
      console.log('Address registered successfully')
    } else {
      // Error al registrar el usuario
      console.error('Failed to register address')
    }
  } catch (error) {
    console.error('An error occurred while registering address:', error)
  }
}

async function findBiggestID (cod) {
  try {
    const direcciones = await getDirecciones(cod)
    if (direcciones.length > 0) {
      // Ordena las direcciones por ID de manera descendente
      direcciones.sort((a, b) => parseInt(b.id) - parseInt(a.id))
      // Devuelve el mayor ID encontrado más 1
      return String(parseInt(direcciones[0].id) + 1)
    } else {
      return '1'
    }
  } catch (error) {
    console.error('Error obteniendo direcciones:', error)
    throw error
  }
}
