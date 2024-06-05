// ProductSalesStats.js
import React, { useState, useEffect } from 'react';

function ProductSalesStats() {
  const [productSales, setProductSales] = useState([]);

  useEffect(() => {
    async function fetchProductSales() {
      try {
        const response = await fetch('http://127.0.0.1:8000/polls/api/product-sales/');
        if (!response.ok) {
          throw new Error('Failed to fetch product sales data');
        }
        const data = await response.json();
        setProductSales(data);
      } catch (error) {
        console.error('Error fetching product sales:', error);
      }
    }

    fetchProductSales();
  }, []);

  return (
    <div>
      <h2>Product Sales Statistics</h2>
      <ul>
        {productSales.map((product) => (
          <li key={product.nombre}>
            {product.nombre}: {product.total_vendido}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductSalesStats;
