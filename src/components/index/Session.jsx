export default function Session () {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'))

  if (loggedInUser) {
    console.log(loggedInUser.username)
  }

  //   function logout () {
  //     localStorage.removeItem('loggedInUser')
  //     window.location.href = 'index.html'
  //   }
  return (
    <div>
      {loggedInUser
        ? (
            <h2>Hola {loggedInUser.username}</h2>
          )
        : (
            <div className="header_login">
            <a className="register">Registrarse</a>
            <a href="./login.html">Iniciar Sesión</a>
          </div>
          )}
    </div>
  )
}
