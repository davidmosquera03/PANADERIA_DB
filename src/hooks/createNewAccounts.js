import { findBiggestCod } from './findBiggestCod.js'

export default async function createNewAccounts (nombre, apellido1, apellido2, clave) {
  const url = 'http://127.0.0.1:8000/polls/api/v1/personas/'
  try {
    const cod = await findBiggestCod()

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cod,
        nombre,
        apellido1,
        apellido2,
        clave
      })
    })

    if (response.ok) {
      // Usuario registrado con éxito
      console.log('User registered successfully')
    } else {
      // Error al registrar el usuario
      console.error('Failed to register user')
    }
    insetInClients(cod)
  } catch (error) {
    console.error('An error occurred while registering user:', error)
  }
}

async function insetInClients (cod) {
  const url = 'http://127.0.0.1:8000/polls/api/v1/clientes/'
  console.log('cod:', cod)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cod
      })
    })

    if (response.ok) {
      // Usuario registrado con éxito
      console.log('User  joined clients successfully')
    } else {
      // Error al registrar el usuario
      console.error('Failed to join in clients')
    }
    insetInClients(cod)
  } catch (error) {
    console.error('An error occurred while registering user:', error)
  }
}
