import { useState, useEffect } from 'react'
import ProductsCards from './ProductsCards.jsx'

export default function Body () {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
      setUser(loggedInUser)
    }

    // Verificar el usuario cuando el componente se monta
    checkUser()

    // Configurar un intervalo para verificar el estado de la sesión cada cierto tiempo
    const intervalId = setInterval(checkUser, 100)

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="container">
      {user
        ? (
        <ProductsCards />
          )
        : (
        <div className="header_login">
          <h2 className="title">Por favor Inicie sesión</h2>
          <p className="description">Nuestra panadería es la mejor</p>
        </div>
          )}
    </section>
  )
}
