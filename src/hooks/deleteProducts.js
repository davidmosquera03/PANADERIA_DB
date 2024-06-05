export default async function deleteProduct(cod) {
    const url = `http://127.0.0.1:8000/polls/api/v1/productos/${cod}`;
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Product deleted successfully');
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('An error occurred while deleting product:', error);
    }
  }
  