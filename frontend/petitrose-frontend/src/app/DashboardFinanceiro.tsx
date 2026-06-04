import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import '../index.css';

// 1. MOCK DATA (Dados simulados para o módulo financeiro)
const resumoFinanceiro = [
    { id: 1, titulo: 'Total de Entradas (Vendas)', valor: 'R$ 8.950,00', detalhe: 'Referente ao mês atual', icone: '💰', cor: '#28a745' },
    { id: 2, titulo: 'Total de Saídas (Despesas)', valor: 'R$ 3.120,00', detalhe: 'Compras de insumos e custos', icone: '📉', cor: '#ff4d4d' },
    { id: 3, titulo: 'Saldo em Caixa', valor: 'R$ 5.830,00', detalhe: 'Lucro real disponível', icone: '🏦', cor: '#710100' },
];

const ultimasTransacoes = [
    // ENTRADAS (Vendas realizadas)
    { id: 'TR-051', tipo: 'Entrada', descricao: 'Pedido #120 (Bolo de Morango + Cupcakes)', data: '04/06/2026', valor: 'R$ 85,00', categoria: 'Venda Balcão', classe: 'status-pago' },
    { id: 'TR-052', tipo: 'Entrada', descricao: 'Pedido #121 (Combo Brigadeiros)', data: '04/06/2026', valor: 'R$ 42,00', categoria: 'Venda Balcão', classe: 'status-pago' },

    // SAÍDAS (Compras de insumos e despesas)
    { id: 'TR-053', tipo: 'Saída', descricao: 'Compra de Insumos (Leite condensado e farinha)', data: '03/06/2026', valor: 'R$ 450,00', categoria: 'Matéria-prima', classe: 'status-pendente' },
    { id: 'TR-054', tipo: 'Saída', descricao: 'Embalagens para Doces e Tortas', data: '02/06/2026', valor: 'R$ 180,00', categoria: 'Embalagens', classe: 'status-pendente' },
    { id: 'TR-055', tipo: 'Entrada', descricao: 'Pedido #119 (Encomenda Cento de Salgados)', data: '02/06/2026', valor: 'R$ 150,00', categoria: 'Encomenda', classe: 'status-pago' },
];

export const DashboardFinanceiro = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">
            {/* Mantém a consistência com a aba ativa correta (se houver essa opção na Navbar) */}
            <Navbar abaAtiva="relatorios" />

            <div className="main-container">
                <div className="content-wrapper">

                    {/* CABEÇALHO DA TELA */}
                    <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                        <h1 style={{ color: '#710100', fontSize: '1.8rem' }}>Gestão Financeira 🍰</h1>
                        <p style={{ color: '#6c757d' }}>Controle de fluxo de caixa, entradas de pedidos e saídas de insumos do Petit Rose.</p>
                    </div>

                    {/* BLOCOS DE RESUMO FINANCEIRO (GRID DE CARDS) */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                        {resumoFinanceiro.map((card) => (
                            <div key={card.id} className="stat-box" style={{ padding: '20px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.95rem', color: '#6c757d', fontWeight: 'bold' }}>{card.titulo}</span>
                                    <span style={{ fontSize: '1.3rem' }}>{card.icone}</span>
                                </div>
                                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: card.cor, margin: '10px 0 5px 0' }}>{card.valor}</p>
                                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>{card.detalhe}</span>
                            </div>
                        ))}
                    </div>

                    {/* SEÇÃO INFERIOR: TABELA DE TRANSAÇÕES E LURCRATIVIDADE */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                        {/* COLUNA DA ESQUERDA: FLUXO DE CAIXA (TABELA) */}
                        <div className="report-container" style={{ padding: '20px' }}>
                            <div className="container-header" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2>Movimentações Recentes</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn btn-sm" style={{ backgroundColor: '#28a745' }}>+ Nova Entrada</button>
                                    <button className="btn btn-sm" style={{ backgroundColor: '#ff4d4d' }}>+ Nova Saída</button>
                                </div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#6c757d', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '10px 5px' }}>Cód</th>
                                    <th>Tipo</th>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th>Data</th>
                                    <th>Valor</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ultimasTransacoes.map((transacao) => (
                                    <tr key={transacao.id} style={{ borderBottom: '1px solid #fdfdfd', fontSize: '0.95rem' }}>
                                        <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#6c757d' }}>{transacao.id}</td>
                                        <td>
                                                <span className={`status-badge ${transacao.classe}`} style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                                                    {transacao.tipo}
                                                </span>
                                        </td>
                                        <td style={{ fontWeight: '500' }}>{transacao.descricao}</td>
                                        <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>{transacao.categoria}</td>
                                        <td style={{ color: '#6c757d' }}>{transacao.data}</td>
                                        <td style={{
                                            fontWeight: 'bold',
                                            color: transacao.tipo === 'Entrada' ? '#28a745' : '#ff4d4d'
                                        }}>
                                            {transacao.tipo === 'Entrada' ? `+ ${transacao.valor}` : `- ${transacao.valor}`}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* COLUNA DA DIREITA: METAS FINANCEIRAS E CONCILIAÇÃO */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* STATUS DA SPRINT 5 (CONCILIAÇÃO) */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header">
                                    <h2>Verificação de Caixa</h2>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#6c757d', margin: '10px 0' }}>
                                    Alinhado com as metas de teste da <strong>Sprint 5</strong> para verificar se o saldo bate perfeitamente com os pedidos.
                                </p>
                                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#e6fffa', borderLeft: '4px solid #319795', fontSize: '0.9rem', color: '#234e52' }}>
                                    <strong>Status:</strong> Caixa Conciliado (100% batendo com os pedidos locais)
                                </div>
                            </div>

                            {/* CENTROS DE CUSTO MAIS ALTOS */}
                            <div className="report-container" style={{ padding: '20px' }}>
                                <div className="container-header">
                                    <h2>Maiores Gastos (Mês)</h2>
                                </div>
                                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                                            <span>Laticínios (Leite cond./Creme de leite)</span>
                                            <strong>45%</strong>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
                                            <div style={{ width: '45%', height: '100%', backgroundColor: '#710100', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                                            <span>Embalagens e Fitas</span>
                                            <strong>25%</strong>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
                                            <div style={{ width: '25%', height: '100%', backgroundColor: '#710100', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                                            <span>Frutas Frescas (Morangos/Limão)</span>
                                            <strong>20%</strong>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
                                            <div style={{ width: '20%', height: '100%', backgroundColor: '#710100', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};