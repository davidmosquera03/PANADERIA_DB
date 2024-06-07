export default async function updateOrderStatus(cod) {
    const url = `http://127.0.0.1:8000/polls/api/v1/pedidos/${cod}/`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: 'Enviado'
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('An error occurred while updating order status:', error);
    }
  }