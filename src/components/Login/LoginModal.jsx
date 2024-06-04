import { useState } from 'react'
import { getWhatever } from '../../hooks/getWhatever.js'

export default function LoginModal () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function authenticate (e) {
    e.preventDefault()
    try {
      const personas = await getWhatever('http://127.0.0.1:8000/polls/api/v1/personas/')
      if (personas) {
        const user = personas.find(persona => persona.nombre === username && persona.clave === password)
        if (user) {
          console.log('Bienvenido')
          sessionStorage.setItem('loggedInUser', JSON.stringify(user))
          window.location.href = 'index.html'
        } else {
          setError('Usuario o contraseña incorrectos')
        }
      } else {
        setError('Error al obtener los datos de los usuarios')
      }
    } catch (error) {
      setError('Hubo un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.')
      console.error('Error during authentication:', error)
    }
  }

  return (
    <div className="LoginModal">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={authenticate}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Iniciar Sesión</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
