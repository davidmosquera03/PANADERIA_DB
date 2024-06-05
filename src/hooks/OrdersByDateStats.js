// OrdersByDateStats.js
import React, { useState, useEffect } from 'react';

export default async function putProductos (fecha, pedidos) {
    const url = 'http://127.0.0.1:8000/polls/api/orders-by-date/'
  const [ordersByDate, setOrdersByDate] = useState([]);

  useEffect(() => {
    async function fetchOrdersByDate() {
      try {
        const response = await fetch('http://127.0.0.1:8000/polls/api/orders-by-date/');
        if (!response.ok) {
          throw new Error('Failed to fetch orders by date data');
        }
        const data = await response.json();
        setOrdersByDate(data);
      } catch (error) {
        console.error('Error fetching orders by date:', error);
      }
    }

    fetchOrdersByDate();
  }, []);

  return (
    <div>
      <h2>Orders by Date Statistics</h2>
      <ul>
        {ordersByDate.map((order) => (
          <li key={order.fecha}>
            {order.fecha}: {order.pedidos} orders
          </li>
        ))}
      </ul>
    </div>
  );
}

