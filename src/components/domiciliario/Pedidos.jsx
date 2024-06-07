
import React, { useState, useEffect } from 'react';
import { getWhatever } from '../../hooks/putProductos.js';
import createDomicilio from '../../hooks/createDomicilio.js';
import updateOrderStatus from '../../hooks/updateOrderStatus.js';

export default function OrderPanel () {

  const [orders, setOrders] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(sessionStorage.getItem('loggedInUser')));
  useEffect(() => {
    const fetchOrders = async () => {
      const url = 'http://127.0.0.1:8000/polls/api/v1/pedidos/';
      const data = await getWhatever(url);
      if (data) {
        const filteredOrders = data.filter(order => order.estado === 'Por enviar'  && order.tipo === 'Domicilio');
        setOrders(filteredOrders);
      }
    };
    fetchOrders();
  }, []);
  const handleButtonClick = async (orderCod) => {
    if (loggedInUser) {
      const personas = await getWhatever('http://127.0.0.1:8000/polls/api/v1/personas/');
      const user = personas.find(persona => persona.nombre === loggedInUser.nombre);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      console.log('orderCod:', orderCod);
      console.log('currentTime:', currentTime);
      console.log('user.cod:', user.cod);

      try {
        await createDomicilio(orderCod, currentTime, user.cod);
        await updateOrderStatus(orderCod);
        
      } catch (error) {
        console.error('An error occurred:', error);
      }
    } else {
      
    }
  };
  return (
    <div class="container">
     <div className="order-list">
      {orders.map(order => (
        <div key={order.cod} className="order-item pending">
          <p>Código: {order.cod}</p>
          <p>Dirección: {order.dir_pedido}</p>
          <p>Tipo: {order.tipo}</p>
          <p>Estado: {order.estado}</p>
          <p>Fecha: {order.fecha}</p>
          <p>Código Cliente: {order.cod_cliente}</p>
          <p>Productos:</p>
          <ul>
            {order.products.map(product => (
              <li key={product}>{product}</li>
            ))}
          </ul>
          <button className="styled-button" onClick={handleButtonClick}>Escoger pedido</button>
        </div>
      ))}
     </div>
    </div>
  );
}