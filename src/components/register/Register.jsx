import React, { useState } from 'react'
import createNewAccounts from '../../hooks/createNewAccounts.js'
import { getWhatever } from '../../hooks/getWhatever.js'
import '../../css/cssPages/register.css'

export default function Register () {
  const [nombre, setNombre] = useState('')
  const [apellido1, setApellido1] = useState('')
  const [apellido2, setApellido2] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createNewAccounts(nombre, apellido1, apellido2, password)
      const personas = await getWhatever('http://127.0.0.1:8000/polls/api/v1/personas/')
      const user = personas.find(persona => persona.nombre === nombre && persona.apellido1 === apellido1 && persona.apellido2 === apellido2)
      sessionStorage.setItem('loggedInUser', JSON.stringify(user))
      window.location.href = 'index.html'
    } catch (error) {
      setError('Error al registrar usuario: ' + error.message)
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />
        <input type="text" value={apellido1} onChange={(e) => setApellido1(e.target.value)} placeholder="Apellido 1" required />
        <input type="text" value={apellido2} onChange={(e) => setApellido2(e.target.value)} placeholder="Apellido 2" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
        <button type="submit">Enviar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
