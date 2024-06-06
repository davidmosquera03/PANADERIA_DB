import React, { useState, useEffect } from 'react';
import { getWhatever } from '../../hooks/putProductos.js';

export default function StatsPanel() {
  const [productSales, setProductSales] = useState([]);
  const [deliveryTimes, setDeliveryTimes] = useState([]);
  const [ordersByDate, setOrdersByDate] = useState([]);

  useEffect(() => {
    const fetchProductSales = async () => {
      const url = 'http://127.0.0.1:8000/polls/api/product-sales/';
      const data = await getWhatever(url);
      if (data) {
        setProductSales(data);
      }
    };

    const fetchDeliveryTimes = async () => {
      const url = 'http://127.0.0.1:8000/polls/api/delivery-times/';
      const data = await getWhatever(url);
      if (data) {
        setDeliveryTimes(data);
      }
    };

    const fetchOrdersByDate = async () => {
      const url = 'http://127.0.0.1:8000/polls/api/orders-by-date/';
      const data = await getWhatever(url);
      if (data) {
        setOrdersByDate(data);
      }
    };

    fetchProductSales();
    fetchDeliveryTimes();
    fetchOrdersByDate();
  }, []);

  return (
    <div className="stats-container">
      <div className="stat-item">
        <h2>Popularidad de productos</h2>
        <div className="stat-content">
          {productSales.map((sale, index) => (
            <div key={index} className="stat-row">
              <div className="stat-info">Producto: {sale.nombre}</div>
              <div className="stat-info">Ventas: {sale.total_vendido}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="stat-item">
        <h2>Tiempos de entrega</h2>
        <div className="stat-content">
          {deliveryTimes.map((delivery, index) => (
            <div key={index} className="stat-row">
              <div className="stat-info">Código: {delivery.cod}</div>
              <div className="stat-info">Tiempo: {delivery.horas} horas {delivery.minutos} minutos</div>
            </div>
          ))}
        </div>
      </div>
      <div className="stat-item">
        <h2>Pedidos por fecha</h2>
        <div className="stat-content">
          {ordersByDate.map((order, index) => (
            <div key={index} className="stat-row">
              <div className="stat-info">Fecha: {order.fecha}</div>
              <div className="stat-info">Pedidos: {order.pedidos}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
