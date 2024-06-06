
import React, { useState, useEffect } from 'react';
import '../src/css/cssPages/PedidosList.css';
const PedidosList = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/polls/api/v1/pedidos/')
            .then(response => response.json())
            .then(data => {
                const pedidosDisponibles = data.filter(pedido => pedido.estado === 'por enviar');
                setPedidos(pedidosDisponibles);
                setLoading(false);
            });
    }, []);

    const handleAceptarPedido = (pedidoId) => {
        const fechaActual = new Date().toISOString();
        // Aquí puedes hacer la llamada al API para actualizar el pedido con la hora de aceptación
        console.log(`Pedido ${pedidoId} aceptado a las ${fechaActual}`);
        // Lógica para actualizar el pedido en el servidor...
    };

    if (loading) {
        return <div>Cargando pedidos...</div>;
    }

    return (
        <div>
            <h2>Pedidos Disponibles</h2>
            <ul>
                {pedidos.map(pedido => (
                    <li key={pedido.id}>
                        <div>
                            <p>Pedido ID: {pedido.id}</p>
                            <p>Descripción: {pedido.descripcion}</p>
                            <button onClick={() => handleAceptarPedido(pedido.id)}>Aceptar Pedido</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PedidosList;