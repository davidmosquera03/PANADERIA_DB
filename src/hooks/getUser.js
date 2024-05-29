// Recuperar información del usuario desde localStorage
const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
if (loggedInUser) {
  console.log(loggedInUser)
  // document.querySelector('.header_login').innerHTML = `
  //   <span>Bienvenido, ${loggedInUser.username}</span>
  //   <a href="#" onclick="logout()">Cerrar Sesión</a>
  // `
}

function logout () {
  localStorage.removeItem('loggedInUser')
  window.location.href = 'index.html'
}
