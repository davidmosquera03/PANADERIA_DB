export default async function createDomicilio(cod, hora_envio, cod_domiciliario) {
    const url = 'http://127.0.0.1:8000/polls/api/v1/domicilios/';
  
    console.log('Creating domicilio with:', { cod, hora_envio, cod_domiciliario });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cod,
          hora_envio,
          hora_entrega: '',
          cod_domiciliario
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to create domicilio');
      }
    } catch (error) {
      console.error('An error occurred while creating domicilio:', error);
    }
  }