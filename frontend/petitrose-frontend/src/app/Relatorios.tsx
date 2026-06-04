import React, { useState } from 'react';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';

// 1. MOCK DATA (Dados simulados para os relatórios analíticos)
const faturamentoPeriodo = [
    { periodo: 'Hoje (04/06)', valor: 850.00, alturaBarra: '45%' },
    { periodo: 'Ontem (03/06)', valor: 1200.00, alturaBarra: '65%' },
    { periodo: 'Esta Semana', valor: 5400.00, alturaBarra: '90%' },
    { periodo: 'Mês Atual', valor: 12450.00, alturaBarra: '100%' },
];

const produtosMaisVendidos = [
    { rank: 1, nome: 'Cupcake Red Velvet', quantidade: 128, faturamento: 'R$ 1.536,00', porcentagem: '100%' },
    { rank: 2, nome: 'Bento Cake (Mini Bolo)', quantidade: 98, faturamento: 'R$ 3.920,00', porcentagem: '76%' },
    { rank: 3, nome: 'Torta Holandesa (Fatia)', quantidade: 72, faturamento: 'R$ 1.080,00', porcentagem: '56%' },
    { rank: 4, nome: 'Brownie Tradicional', quantidade: 54, faturamento: 'R$ 432,00', porcentagem: '42%' },
];

export const Relatorios = () => {
    const [filtroData, setFiltroData] = useState('mes');

    const handleExportarPDF = () => {
        Swal.fire({
            title: 'Exportando Relatório...',
            text: 'O arquivo PDF está sendo gerado com os dados consolidados.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
            willClose: () => {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Relatório exportado com sucesso para a pasta de downloads.',
                    icon: 'success',
                    confirmButtonColor: '#710100'
                });
            }
        });
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="relatorios" />

            <div className="main-container">
                <div className="content-wrapper">

                    {/* CABEÇALHO COM FILTRO */}
                    <div className="dashboard-header" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.8rem' }}>Relatórios e Indicadores 📊</h1>
                            <p style={{ color: '#6c757d' }}>Análise de desempenho de vendas, faturamento e saída de produtos do Petit Rose.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <select
                                value={filtroData}
                                onChange={(e) => setFiltroData(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff' }}
                            >
                                <option value="hoje">Filtrar por: Hoje</option>
                                <option value="semana">Filtrar por: Últimos 7 dias</option>
                                <option value="mes">Filtrar por: Este Mês</option>
                            </select>
                            <button className="btn btn-sm" onClick={handleExportarPDF}>
                                📄 Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* SEÇÃO PRINCIPAL DE GRÁFICOS (GRID) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>

                        {/* CARD 1: VISUALIZAÇÃO DE FATURAMENTO (GRÁFICO DE BARRAS VERTICAIS) */}
                        <div className="report-container" style={{ padding: '20px' }}>
                            <div className="container-header" style={{ marginBottom: '20px' }}>
                                <h2>Comparativo de Faturamento</h2>
                            </div>

                            {/* Área do Gráfico */}
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px', position: 'relative' }}>
                                {faturamentoPeriodo.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                                        {/* Valor no topo da barra */}
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#710100', marginBottom: '5px' }}>
                                            R$ {item.valor.toFixed(0)}
                                        </span>
                                        {/* Barra do gráfico */}
                                        <div style={{
                                            width: '100%',
                                            height: item.alturaBarra,
                                            backgroundColor: '#710100',
                                            borderRadius: '4px 4px 0 0',
                                            opacity: idx === 3 ? 1 : 0.6, // Destaca a última barra (Mês)
                                            transition: 'height 0.5s ease-in-out'
                                        }}></div>
                                        {/* Legenda abaixo do eixo */}
                                        <span style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            {item.periodo}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CARD 2: RANKING DE PRODUTOS MAIS VENDIDOS (BARRAS HORIZONTAIS) */}
                        <div className="report-container" style={{ padding: '20px' }}>
                            <div className="container-header" style={{ marginBottom: '20px' }}>
                                <h2>Produtos Líderes de Vendas 🏆</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {produtosMaisVendidos.map((prod) => (
                                    <div key={prod.rank}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <span><strong>{prod.rank}º</strong> {prod.nome} ({prod.quantidade} un)</span>
                                            <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>Giro: {prod.faturamento}</span>
                                        </div>
                                        {/* Barra horizontal */}
                                        <div style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: prod.porcentagem,
                                                height: '100%',
                                                backgroundColor: '#710100',
                                                opacity: 1 - (prod.rank * 0.15), // Efeito cascata de opacidade baseado no rank
                                                borderRadius: '6px'
                                            }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* SEÇÃO INFERIOR: DETALHAMENTO DA SPRINT 5 (CONCILIAÇÃO) */}
                    <div className="report-container" style={{ padding: '20px' }}>
                        <div className="container-header" style={{ marginBottom: '15px' }}>
                            <h2>Auditoria e Fechamento de Caixa</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <div style={{ padding: '12px', backgroundColor: '#fdfdfd', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>Total Registrado no Sistema</span>
                                <h3 style={{ color: '#28a745', marginTop: '5px' }}>R$ 12.450,00</h3>
                            </div>
                            <div style={{ padding: '12px', backgroundColor: '#fdfdfd', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>Total em Pedidos Confirmados</span>
                                <h3 style={{ color: '#28a745', marginTop: '5px' }}>R$ 12.450,00</h3>
                            </div>
                            <div style={{ padding: '12px', backgroundColor: '#e6fffa', borderRadius: '6px', border: '1px solid #319795' }}>
                                <span style={{ fontSize: '0.85rem', color: '#234e52' }}>Divergência / Quebra de Caixa</span>
                                <h3 style={{ color: '#319795', marginTop: '5px' }}>R$ 0,00 (Perfeito)</h3>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};