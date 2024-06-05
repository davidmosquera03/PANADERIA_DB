import React, { useState, useEffect } from 'react';
import { getWhatever } from '../../hooks/putProductos.js';

export default function OrderPanel () {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const url = 'http://127.0.0.1:8000/polls/api/v1/pedidos/';
      const data = await getWhatever(url);
      if (data) {
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div class="container">
     <div className="order-list">
      {orders.map(order => (
        <div key={order.cod} className={`order-item ${order.estado === 'Enviado' ? 'pending' : 'completed'}`}>
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
        </div>
      ))}
     </div>
    </div>
  );
}


