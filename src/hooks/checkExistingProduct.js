// checkExistingProduct.js

// Esta función hace una solicitud al servidor para verificar si ya existe un producto con el mismo código
export default async function checkExistingProduct(cod) {
    const url = `http://127.0.0.1:8000/polls/api/v1/productos/${cod}`;
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data ? true : false; // Devuelve true si existe un producto con el mismo código, de lo contrario, devuelve false
      } else {
        console.error('Error al verificar el producto existente:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar el producto existente:', error);
      return false;
    }
  }
  