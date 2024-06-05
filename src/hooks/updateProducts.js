export default async function updateProduct(cod, nombre, descripcion, precio, cat) {
    const url = `http://127.0.0.1:8000/polls/api/v1/productos/${cod}`;
  
    try {
      console.log('URL:', url);
      console.log('Datos a enviar:', { nombre, descripcion, precio, cat });
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio,
          cat,
        }),
      });
  
      console.log('Respuesta:', response);
  
      if (response.ok) {
        console.log('Producto actualizado exitosamente');
      } else {
        console.error('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Se produjo un error al actualizar el producto:', error);
    }
  }
  