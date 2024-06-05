import React, { useState } from 'react'
import addProducts from '../../hooks/addProducts.js'
import deleteProduct from '../../hooks/deleteProducts.js'; 
import updateProduct from '../../hooks/updateProducts.js';

export default function AdminPanel () {

  const [cod, setCod] = useState('')
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [cat, setCat] = useState('')

  const handleAdd = async (event) => {
    event.preventDefault()

      // Verificar si algún campo está vacío
    if (!cod || !nombre || !descripcion || !precio || !cat) {
      alert("Complete todos los campos");
      return; // Detener la ejecución si hay campos vacíos
    }

    try {
      await addProducts(cod, nombre, descripcion, precio, cat)
      alert('Producto añadido correctamente.');
    } catch (error) {
      console.error('Error al añadir producto:', error)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault();

    // Verificar si el campo 'cod' está vacío
    if (!cod) {
      alert("Ingrese el código del producto a eliminar");
      return; // Detener la ejecución si 'cod' está vacío
    }

    try {
      await deleteProduct(cod);
      alert('Producto eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };
  
  const handleUpdate = async (event) => {
    event.preventDefault();

    // Verificar si algún campo está vacío
    if (!cod || !nombre || !descripcion || !precio || !cat) {
      alert("Complete todos los campos");
      return; // Detener la ejecución si hay campos vacíos
  }

    try {
      // Validar que el código del producto esté presente
      if (!cod) {
        alert('Ingrese el código del producto.');
        return;
      }

      // Realizar la actualización solo si al menos un campo ha sido modificado
      if (nombre || descripcion || precio || cat) {
        console.log('Datos a enviar a updateProduct:', cod, nombre, descripcion, precio, cat);
        await updateProduct(cod, nombre, descripcion, precio, cat);
        alert('Producto actualizado correctamente.');
      } else {
        alert('No se ha realizado ninguna modificación.');
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar el producto. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <form className="admin-form">
      <input type="text" value={cod} onChange={(e) => setCod(e.target.value)} placeholder="Código" />
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
      <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" />
      <select value={cat} onChange={(e) => setCat(e.target.value)} placeholder="Categoria">
      <option value="1">Panadería</option>
      <option value="2">Repostería</option>
      <option value="3">Bebida</option>
      </select>

      <div class="button-container">
        <button type="button" onClick={handleAdd}>Añadir</button>
        <button type="button" onClick={handleDelete}>Eliminar</button>
        <button type="button" onClick={handleUpdate}>Actualizar</button>
      </div>
    </form>
  )  
 }

