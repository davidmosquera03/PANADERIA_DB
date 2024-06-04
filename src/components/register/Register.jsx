import React, { useState } from 'react'
import createNewAccounts from '../../hooks/createNewAccounts.js'

export default function Register () {
  const [nombre, setNombre] = useState('')
  const [apellido1, setApellido1] = useState('')
  const [apellido2, setApellido2] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createNewAccounts(nombre, apellido1, apellido2, password)
    } catch (error) {
      console.error('Error al registrar usuario:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <input type="text" value={apellido1} onChange={(e) => setApellido1(e.target.value)} placeholder="Apellido 1" />
      <input type="text" value={apellido2} onChange={(e) => setApellido2(e.target.value)} placeholder="Apellido 2" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Enviar</button>
    </form>
  )
}
