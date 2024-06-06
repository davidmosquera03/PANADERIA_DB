import React from 'react';
import PedidosList from './domiciliario/PedidosList';
import '../css/cssPages/App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Panel de Pedidos</h1>
            </header>
            <PedidosList />
        </div>
    );
}

export default App;