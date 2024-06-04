import { getWhatever } from '../../hooks/getWhatever.js'
import { useState, useEffect } from 'react'

export default function Session () {
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(sessionStorage.getItem('loggedInUser')))

  useEffect(() => {
    getWhatever('http://127.0.0.1:8000/polls/api/v1/personas/').then(personas => {
    })
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser')
    setLoggedInUser(null)
  }

  return (
    <div>
      {loggedInUser
        ? (
        <div className="user-session">
          <h2 className="welcome-message">Hola {loggedInUser.nombre}</h2>
          <button className="logout-button" onClick={handleLogout}>CERRAR SESIÓN</button>
        </div>
          )
        : (
        <div className="header_login">
          <a href="./register.html" className="register">Registrarse</a>
          <a href="./login.html">Iniciar Sesión</a>
        </div>
          )}
    </div>
  )
}
