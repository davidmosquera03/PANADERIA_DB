import { findBiggestCod } from './findBiggestCod.js'

export default async function createNewAccounts (nombre, apellido1, apellido2, clave) {
  const url = 'http://127.0.0.1:8000/polls/api/v1/personas/'
  try {
    const cod = await findBiggestCod()
    console.log('cod', cod)
    console.log('nombre', nombre)
    console.log('apellido1', apellido1)
    console.log('apellido2', apellido2)
    console.log('password', clave)

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
  } catch (error) {
    console.error('An error occurred while registering user:', error)
  }
}
