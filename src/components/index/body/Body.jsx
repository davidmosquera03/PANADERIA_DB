import { useState, useEffect } from 'react'
import ProductsCards from './ProductsCards.jsx'

export default function Body () {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
    setUser(loggedInUser)
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
