import React, { useState } from 'react'
import addProducts from '../../hooks/addProducts.js'

export default function Add () {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await addProducts(code, name, description, price, category)
    } catch (error) {
      console.error('Error al añadir producto:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código" />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" />
      <input type="select" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria" />
      <button type="submit">Enviar</button>
    </form>
  )
}
