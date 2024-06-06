export default async function knowRol (cod) {
  const urls = [
    { url: `http://127.0.0.1:8000/polls/api/v1/clientes/${cod}/`, role: 'cliente' },
    { url: `http://127.0.0.1:8000/polls/api/v1/administradores/${cod}/`, role: 'admin' },
    { url: `http://127.0.0.1:8000/polls/api/v1/domiciliarios/${cod}/`, role: 'domiciliario' }
  ]

  try {
    for (const { url, role } of urls) {
      const response = await fetch(url)
      if (response.ok) {
        return role
      }
    }
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
  }

  return null // Retorna null si no se encuentra ningún rol
}
