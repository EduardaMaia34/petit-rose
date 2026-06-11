import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import '../index.css';

// 1. MOCK DATA (Apenas os 3 cards corretos no topo)
const cardsResumo = [
    { id: 1, titulo: 'Vendas do Mês', valor: 'R$ 12.450,00', detalhe: '↑ 12% em relação ao mês anterior', icone: '💰' },
    { id: 2, titulo: 'Pedidos Realizados', valor: '325', detalhe: 'Total de pedidos no período', icone: '🛍️' },
    { id: 3, titulo: 'Lucro Líquido', valor: 'R$ 7.850,00', detalhe: '↑ 15% em relação ao mês anterior', icone: '📈' },
];

const ultimosPedidos = [
    { id: '#120', data: '18/05/2026 14:30', valor: 'R$ 85,00', status: 'Em preparo', classeStatus: 'status-preparo' },
    { id: '#121', data: '18/05/2026 15:10', valor: 'R$ 42,00', status: 'Pago', classeStatus: 'status-pago' },
    { id: '#122', data: '18/05/2026 16:20', valor: 'R$ 120,00', status: 'Entregue', classeStatus: 'status-pago' },
    { id: '#123', data: '18/05/2026 16:45', valor: 'R$ 65,00', status: 'Confirmado', classeStatus: 'status-preparo' },
];

const vendasPorMes = [
    { mes: 'Dez', valor: 50 },
    { mes: 'Jan', valor: 85 },
    { mes: 'Fev', valor: 65 },
    { mes: 'Mar', valor: 90 },
    { mes: 'Abr', valor: 100 },
    { mes: 'Mai', valor: 120 },
];

const produtosMaisVendidos = [
    { nome: 'Cupcake Red Velvet', porcentagem: 85 },
    { nome: 'Bento Cake', porcentagem: 70 },
    { nome: 'Torta Holandesa', porcentagem: 55 },
    { nome: 'Brownie', porcentagem: 40 },
];

export const MenuAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="inicio" />

            <div className="main-container">
                <div className="content-wrapper">

                    {/* CABEÇALHO DO DASHBOARD */}
                    <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                        <h1 style={{ color: '#710100', fontSize: '1.8rem' }}>Olá, Administrador! 👋</h1>
                        <p style={{ color: '#6c757d' }}>Aqui está um resumo geral da sua confeitaria.</p>
                    </div>

                    {/* 3 CARDS SUPERIORES */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
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

                    {/* SEÇÃO INFERIOR PRINCIPAL (DIVIDIDA EM DUAS COLUNAS: ESQUERDA 2fr, DIREITA 1fr) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                        {/* COLUNA DA ESQUERDA: GRÁFICOS E TABELA DE PEDIDOS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                            {/* GRID COM OS 4 GRÁFICOS INTERNOS */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <h2 style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#710100' }}>Indicadores de Desempenho</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                                    {/* G1: Vendas por Mês */}
                                    <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#6c757d' }}>Vendas por Mês</span>
                                        <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '15px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                                            {vendasPorMes.map((g) => (
                                                <div key={g.mes} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                                    <div style={{ width: '12px', height: `${g.valor / 1.3}px`, backgroundColor: '#710100', borderRadius: '3px 3px 0 0' }}></div>
                                                    <span style={{ fontSize: '0.7rem', color: '#6c757d', marginTop: '4px' }}>{g.mes}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* G2: Produtos Mais Vendidos */}
                                    <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#6c757d' }}>Produtos Mais Vendidos</span>
                                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {produtosMaisVendidos.map((p) => (
                                                <div key={p.nome}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                                                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{p.nome}</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
                                                        <div style={{ width: `${p.porcentagem}%`, height: '100%', backgroundColor: '#ff9999', borderRadius: '3px' }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* G3: Resumo Financeiro */}
                                    <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#6c757d', marginBottom: '10px' }}>Resumo Financeiro</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.8rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Entradas:</span><strong style={{ color: '#28a745' }}>R$ 12.450</strong></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saídas:</span><strong style={{ color: '#dc3545' }}>R$ 4.600</strong></div>
                                            <div style={{ borderTop: '1px solid #ddd', paddingTop: '4px', display: 'flex', justifyContent: 'space-between' }}><span>Saldo:</span><strong>R$ 7.850</strong></div>
                                        </div>
                                    </div>

                                    {/* G4: Formas de Pagamento */}
                                    <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'conic-gradient(#710100 0% 60%, #ff9999 60% 90%, #e0e0e0 90% 100%)', flexShrink: 0 }}></div>
                                        <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#710100', marginRight: '4px' }}></span>Pix (60%)</div>
                                            <div><span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#ff9999', marginRight: '4px' }}></span>Cartão (30%)</div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* TABELA DE ÚLTIMOS PEDIDOS CORRIGIDA (SEM CLIENTE NENHUM) */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header" style={{ marginBottom: '15px' }}>
                                    <h2>Últimos Pedidos</h2>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#6c757d', fontSize: '0.9rem' }}>
                                        <th style={{ padding: '10px 5px' }}>Pedido</th>
                                        <th>Data</th>
                                        <th>Valor</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ultimosPedidos.map((pedido) => (
                                        <tr key={pedido.id} style={{ borderBottom: '1px solid #fdfdfd', fontSize: '0.95rem' }}>
                                            <td style={{ padding: '12px 5px', fontWeight: 'bold' }}>{pedido.id}</td>
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

                        {/* COLUNA DA DIREITA: ALERTAS FILTRADOS E AÇÕES RÁPIDAS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* ALERTAS DO SISTEMA (Apenas atrasados/pagamentos) */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header">
                                    <h2>Alertas</h2>
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#fff9db', borderLeft: '4px solid #fcc419', fontSize: '0.9rem' }}>
                                        <strong>Pedido Atrasado:</strong> Pedido #102
                                    </div>
                                    <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#ffe3e3', borderLeft: '4px solid #ff4d4d', fontSize: '0.9rem' }}>
                                        <strong>Pagamento Pendente:</strong> Pedido #115
                                    </div>
                                </div>
                            </div>

                            {/* SEÇÃO DE AÇÕES RÁPIDAS */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header">
                                    <h2>Ações Rápidas</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                    <button className="btn btn-sm" onClick={() => navigate('/cadastro-produto')} style={{ padding: '10px', fontSize: '0.8rem' }}>🍰 Novo Produto</button>
                                    <button className="btn btn-sm" style={{ padding: '10px', fontSize: '0.8rem' }}>🛍️ Novo Pedido</button>
                                    <button className="btn btn-sm" style={{ padding: '10px', fontSize: '0.8rem' }}>⬇️ Entradas</button>
                                    <button className="btn btn-sm" style={{ padding: '10px', fontSize: '0.8rem' }}>⬆️ Saídas</button>
                                    <button className="btn btn-sm" style={{ padding: '10px', fontSize: '0.8rem', gridColumn: 'span 2' }}>📊 Relatório Geral</button>
                                </div>
                            </div>

                            {/* SEÇÃO DE AÇÕES RÁPIDAS (ATUALIZADA PARA TESTES DAS NOVAS TELAS) */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header">
                                    <h2 style={{ color: '#710100', fontSize: '1.1rem' }}>🧪 Testar Novas Telas</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: '15px' }}>

                                    <button
                                        className="btn btn-sm"
                                        onClick={() => navigate('/dashboard-financeiro')}
                                        style={{ padding: '12px', fontSize: '0.85rem', textAlign: 'left', backgroundColor: '#710100' }}
                                    >
                                        💰 Dashboard Financeiro
                                    </button>

                                    <button
                                        className="btn btn-sm"
                                        onClick={() => navigate('/cadastro-despesa')}
                                        style={{ padding: '12px', fontSize: '0.85rem', textAlign: 'left', backgroundColor: '#710100' }}
                                    >
                                        📉 Registrar Despesa
                                    </button>

                                    <button
                                        className="btn btn-sm"
                                        onClick={() => navigate('/controle-estoque')}
                                        style={{ padding: '12px', fontSize: '0.85rem', textAlign: 'left', backgroundColor: '#710100' }}
                                    >
                                        📦 Controle de Estoque
                                    </button>

                                    <button
                                        className="btn btn-sm"
                                        onClick={() => navigate('/relatorios')}
                                        style={{ padding: '12px', fontSize: '0.85rem', textAlign: 'left', backgroundColor: '#710100' }}
                                    >
                                        📊 Tela de Relatórios
                                    </button>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};