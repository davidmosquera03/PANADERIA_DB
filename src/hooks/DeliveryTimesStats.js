// DeliveryTimesStats.js
import React, { useState, useEffect } from 'react';

function DeliveryTimesStats() {
  const [deliveryTimes, setDeliveryTimes] = useState([]);

  useEffect(() => {
    async function fetchDeliveryTimes() {
      try {
        const response = await fetch('http://127.0.0.1:8000/polls/api/delivery-times/');
        if (!response.ok) {
          throw new Error('Failed to fetch delivery times data');
        }
        const data = await response.json();
        setDeliveryTimes(data);
      } catch (error) {
        console.error('Error fetching delivery times:', error);
      }
    }

    fetchDeliveryTimes();
  }, []);

  return (
    <div>
      <h2>Delivery Times Statistics</h2>
      <ul>
        {deliveryTimes.map((delivery) => (
          <li key={delivery.cod}>
            Delivery #{delivery.cod}: {delivery.horas} hours {delivery.minutos} minutes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeliveryTimesStats;
