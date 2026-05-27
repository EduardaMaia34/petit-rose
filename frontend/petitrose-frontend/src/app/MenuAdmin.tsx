import React from 'react';
import logoPetitRose from '../assets/Logo.png'; // Corrigido para carregar como componente do React
import '../index.css';

export const MenuAdmin = () => {
    return (
        /* Envolvido pela div .dashboard-page para herdar as fontes e o comportamento correto */
        <div className="dashboard-page">
            <div className="welcome-page">
                <div className="border-externa">
                    <div className="container">
                        {/* Corrigido para ler a imagem importada dos seus assets */}
                        <img src={logoPetitRose} alt="Logo Petit Rose" className="logo" />

                        <h1>BEM-VINDO(A) AO PETIT ROSE</h1>

                        <button className="btn">Produtos</button>
                        <button className="btn">Clientes</button>
                        <button className="btn">Pedidos</button>

                        <div className="footer">
                            Feito com amor e açúcar 🍰
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};