import React from 'react';
import '../index.css';
import { Navbar } from './Navbar';

export const MenuCliente = () => {
    return (
        /* Substituído o style inline pela classe .dashboard-page para restaurar o fundo creme original */
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />
            {/* CONTEÚDO PRINCIPAL */}
            <div className="main-container">
                <div className="content-wrapper">

                    {/* RELATÓRIO MENSAL */}
                    <div className="report-container">
                        <div className="container-header">
                            <h2>Relatório Mensal</h2>
                        </div>
                        <div className="stats-container">
                            <div className="stat-box">
                                <h3>Pedidos Concluídos</h3>
                                <p>120</p>
                            </div>
                            <div className="stat-box">
                                <h3>Lucro Bruto</h3>
                                <p>R$ 2.450,00</p>
                            </div>
                            <div className="stat-box">
                                <h3>Novos Clientes</h3>
                                <p>15</p>
                            </div>
                        </div>
                    </div>

                    {/* SEÇÃO DE PEDIDOS */}
                    <div className="report-container">
                        <div className="container-header">
                            <h2>Pedidos Recentes</h2>
                            <button className="btn btn-novo">Novo Pedido</button>
                        </div>

                        <div className="pedidos-grid">
                            {/* CARD 1 */}
                            <div className="pedido-card">
                                <div className="pedido-header">
                                    <span>Pedido #1024</span>
                                    <span className="status-badge status-pendente">Pendente</span>
                                </div>
                                <div className="pedido-itens">
                                    1x Bolo de Morango<br />
                                    2x Cupcake de Chocolate
                                </div>
                                <div className="pedido-total">
                                    Total: R$ 85,00
                                </div>
                                <div className="pedido-acoes">
                                    <button className="btn btn-sm">Aceitar Pedido</button>
                                </div>
                            </div>

                            {/* CARD 2 */}
                            <div className="pedido-card">
                                <div className="pedido-header">
                                    <span>Pedido #1023</span>
                                    <span className="status-badge status-preparo">Em Preparo</span>
                                </div>
                                <div className="pedido-itens">
                                    1x Torta de Limão
                                </div>
                                <div className="pedido-total">
                                    Total: R$ 45,00
                                </div>
                                <div className="pedido-acoes">
                                    <button className="btn btn-sm">Pronto para Entrega</button>
                                </div>
                            </div>

                            {/* CARD 3 */}
                            <div className="pedido-card">
                                <div className="pedido-header">
                                    <span>Pedido #1022</span>
                                    <span className="status-badge status-pago">Concluído</span>
                                </div>
                                <div className="pedido-itens">
                                    5x Brigadeiro Gourmet
                                </div>
                                <div className="pedido-total">
                                    Total: R$ 25,00
                                </div>
                                <div className="pedido-acoes">
                                    <button className="btn btn-sm" style={{ backgroundColor: '#e0e0e0', cursor: 'not-allowed' }} disabled>Concluído</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};