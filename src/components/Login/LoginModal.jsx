import { useState } from 'react'
import usuarios from '../../hooks/usuarios.json'

export default function LoginModal () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function authenticate (e) {
    e.preventDefault()
    const user = usuarios.find(user => user.username === username && user.password === password)
    if (user) {
      console.log('Bienvenido')
      sessionStorage.setItem('loggedInUser', JSON.stringify(user))
      window.location.href = 'index.html'
    } else {
      console.log('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="LoginModal">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={authenticate}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  )
}
