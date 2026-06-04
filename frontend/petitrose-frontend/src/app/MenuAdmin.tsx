import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import '../index.css';

// 1. MOCK DATA (Dados simulados idênticos à imagem image_ed9b48.jpg)
const cardsResumo = [
    { id: 1, titulo: 'Vendas do Mês', valor: 'R$ 12.450,00', detalhe: '↑ 12% em relação ao mês anterior', icone: '💰' },
    { id: 2, titulo: 'Pedidos Realizados', valor: '325', detalhe: 'Total de pedidos no período', icone: '🛍️' },
    { id: 3, titulo: 'Lucro Líquido', valor: 'R$ 7.850,00', detalhe: '↑ 15% em relação ao mês anterior', icone: '📈' },
    { id: 4, titulo: 'Produtos em Estoque Baixo', valor: '8', detalhe: 'Produtos com estoque crítico', icone: '📦' },
    { id: 5, titulo: 'Clientes Ativos', valor: '154', detalhe: 'Clientes cadastrados', icone: '👥' },
];

const ultimosPedidos = [
    { id: '#120', cliente: 'Maria Silva', data: '18/05/2026 14:30', valor: 'R$ 85,00', status: 'Em preparo', classeStatus: 'status-preparo' },
    { id: '#121', cliente: 'João Santos', data: '18/05/2026 15:10', valor: 'R$ 42,00', status: 'Pago', classeStatus: 'status-pago' },
    { id: '#122', cliente: 'Ana Costa', data: '18/05/2026 16:20', valor: 'R$ 120,00', status: 'Entregue', classeStatus: 'status-pago' }, // Reaproveitando classe verde
    { id: '#123', cliente: 'Carlos Lima', data: '18/05/2026 16:45', valor: 'R$ 65,00', status: 'Confirmado', classeStatus: 'status-preparo' },
];

export const MenuAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="inicio" />

            <div className="main-container">
                <div className="content-wrapper">

                    {/* CABEÇALHO DO DASHBOARD */}
                    <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.8rem' }}>Olá, Administrador! 👋</h1>
                            <p style={{ color: '#6c757d' }}>Aqui está um resumo geral da sua confeitaria.</p>
                        </div>
                    </div>

                    {/* BLOCOS DE RESUMO SUPERIOR (GRID DE CARDS) */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                        {cardsResumo.map((card) => (
                            <div key={card.id} className="stat-box" style={{ padding: '15px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: 'bold' }}>{card.titulo}</span>
                                    <span style={{ fontSize: '1.2rem' }}>{card.icone}</span>
                                </div>
                                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#710100', margin: '10px 0 5px 0' }}>{card.valor}</p>
                                <span style={{ fontSize: '0.75rem', color: '#28a745' }}>{card.detalhe}</span>
                            </div>
                        ))}
                    </div>

                    {/* SEÇÃO INFERIOR DIVIDIDA EM DUAS COLUNAS PRINCIPAIS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                        {/* COLUNA DA ESQUERDA: PEDIDOS E FINANCEIRO */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* TABELA DE ÚLTIMOS PEDIDOS */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header" style={{ marginBottom: '15px' }}>
                                    <h2>Últimos Pedidos</h2>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#6c757d', fontSize: '0.9rem' }}>
                                        <th style={{ padding: '10px 5px' }}>Pedido</th>
                                        <th>Cliente</th>
                                        <th>Data</th>
                                        <th>Valor</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ultimosPedidos.map((pedido) => (
                                        <tr key={pedido.id} style={{ borderBottom: '1px solid #fdfdfd', fontSize: '0.95rem' }}>
                                            <td style={{ padding: '12px 5px', fontWeight: 'bold' }}>{pedido.id}</td>
                                            <td>{pedido.cliente}</td>
                                            <td style={{ color: '#6c757d' }}>{pedido.data}</td>
                                            <td style={{ fontWeight: '500' }}>{pedido.valor}</td>
                                            <td>
                                                    <span className={`status-badge ${pedido.classeStatus}`}>
                                                        {pedido.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* COLUNA DA DIREITA: ALERTAS E AÇÕES RÁPIDAS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* ALERTAS DO SISTEMA */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header">
                                    <h2>Alertas</h2>
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#fff5f5', borderLeft: '4px solid #ff4d4d', fontSize: '0.9rem' }}>
                                        <strong>Estoque Baixo:</strong> Farinha de Trigo (3kg restando)
                                    </div>
                                    <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#fff5f5', borderLeft: '4px solid #ff4d4d', fontSize: '0.9rem' }}>
                                        <strong>Estoque Baixo:</strong> Morango (2 bandejas restando)
                                    </div>
                                    <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#fff9db', borderLeft: '4px solid #fcc419', fontSize: '0.9rem' }}>
                                        <strong>Pedido Atrasado:</strong> Pedido #102
                                    </div>
                                </div>
                            </div>

                            {/* SEÇÃO DE AÇÕES RÁPIDAS (BOTÕES) */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header">
                                    <h2>Ações Rápidas</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                    <button className="btn btn-sm" onClick={() => navigate('/cadastro-produto')} style={{ padding: '12px', fontSize: '0.85rem' }}>🍰 Novo Produto</button>
                                    <button className="btn btn-sm" style={{ padding: '12px', fontSize: '0.85rem' }}>🛍️ Novo Pedido</button>
                                    <button className="btn btn-sm" style={{ padding: '12px', fontSize: '0.85rem', gridColumn: 'span 2' }}>📊 Gerar Relatório</button>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};