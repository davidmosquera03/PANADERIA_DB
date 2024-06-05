export default async function putProductos (cod, nombre, descripcion, precio, cat) {
    const url = 'http://127.0.0.1:8000/polls/api/v1/productos/'

    try {
        console.log('cod', cod)
        console.log('nombre', nombre)
        console.log('descripcion', descripcion)
        console.log('precio', precio)
        console.log('cat', cat)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cod,
            nombre,
            descripcion,
            precio,
            cat,
        })
      })

      if (response.ok) {
        console.log('Product added successfully')
      } else {
        console.error('Failed to add product')
      }
    } catch (error) {
      console.error('An error occurred while adding product:', error)
    }
};
