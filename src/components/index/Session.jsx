import { getPersonas } from '../../hooks/getPersonas.js'

export default function Session () {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'))

  if (loggedInUser) {
    console.log(loggedInUser.username)
  }

  getPersonas().then(personas => {
    console.log(personas)
  })

  return (
    <div>
      {loggedInUser
        ? (
            <h2>Hola {loggedInUser.username}</h2>
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
