import React, { useState } from 'react';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';
import { MdPictureAsPdf, MdAdd, MdTrendingUp, MdCheckCircle } from 'react-icons/md';

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
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* 1. CABEÇALHO ULTRA COMPACTO - COM MARGEM NEGATIVA */}
                    <div className="dashboard-header" style={{ marginBottom: '-10px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.7rem', fontWeight: 'bold', margin: '0' }}>Relatórios e Indicadores</h1>
                            <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0', fontSize: '0.85rem' }}>Análise de desempenho de vendas, faturamento e saída de produtos do Petit Rose.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select
                                value={filtroData}
                                onChange={(e) => setFiltroData(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '0.85rem', color: '#495057', cursor: 'pointer' }}
                            >
                                <option value="hoje">Filtrar por: Hoje</option>
                                <option value="semana">Filtrar por: Últimos 7 dias</option>
                                <option value="mes">Filtrar por: Este Mês</option>
                            </select>
                            <button
                                className="btn btn-sm"
                                style={{ backgroundColor: '#710100', color: '#fff', padding: '9px 15px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
                                onClick={handleExportarPDF}
                            >
                                <MdPictureAsPdf style={{ fontSize: '1.1rem' }} /> Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* 2. SEÇÃO PRINCIPAL DE GRÁFICOS (GRID COESÃO COM GAP REDUZIDO) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '4px', marginBottom: '12px', width: '100%' }}>

                        {/* CARD 1: COMPARATIVO DE FATURAMENTO (BARRAS VERTICAIS) */}
                        <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div className="container-header" style={{ marginBottom: '15px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                                <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '22px' }}>Comparativo de Faturamento</h2>
                            </div>

                            {/* Área do Gráfico Relativa */}
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', borderBottom: '2px solid #fff1f1', paddingBottom: '5px', marginTop: '10px' }}>
                                {faturamentoPeriodo.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '65px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#710100', marginBottom: '4px', fontFamily: 'Georgia' }}>
                                            R$ {item.valor.toFixed(0)}
                                        </span>
                                        <div style={{
                                            width: '100%',
                                            height: item.alturaBarra,
                                            backgroundColor: '#710100',
                                            borderRadius: '4px 4px 0 0',
                                            opacity: idx === 3 ? 1 : 0.55,
                                            transition: 'height 0.5s ease-in-out'
                                        }}></div>
                                        <span style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                            {item.periodo}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CARD 2: PRODUTOS LÍDERES (BARRAS HORIZONTAIS) */}
                        <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div className="container-header" style={{ marginBottom: '15px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                                <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '22px' }}>Produtos Líderes de Vendas</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                {produtosMaisVendidos.map((prod) => (
                                    <div key={prod.rank}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: '#3c1010' }}>
                                            <span><strong>{prod.rank}º</strong> {prod.nome} <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>({prod.quantidade} un)</span></span>
                                            <span style={{ fontWeight: 'bold', color: '#710100' }}>{prod.faturamento}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: prod.porcentagem,
                                                height: '100%',
                                                backgroundColor: '#710100',
                                                opacity: 1 - (prod.rank * 0.12),
                                                borderRadius: '4px'
                                            }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* 3. SEÇÃO INFERIOR: AUDITORIA ESTILIZADA EM EMBALAGEM DE CARDS COMPACTOS */}
                    <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <div className="container-header" style={{ marginBottom: '10px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                            <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '22px' }}>Auditoria e Fechamento de Caixa</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
                            <div style={{ padding: '12px 15px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #f0e6e6', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#6c757d', fontWeight: 'bold' }}>Total Registrado no Sistema</span>
                                <h3 style={{ color: '#28a745', margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Georgia', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MdAdd style={{ fontSize: '1.1rem' }} /> R$ 12.450,00
                                </h3>
                            </div>

                            <div style={{ padding: '12px 15px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #f0e6e6', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#6c757d', fontWeight: 'bold' }}>Total em Pedidos Confirmados</span>
                                <h3 style={{ color: '#28a745', margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Georgia', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MdTrendingUp style={{ fontSize: '1.1rem' }} /> R$ 12.450,00
                                </h3>
                            </div>

                            <div style={{ padding: '12px 15px', backgroundColor: '#e6f7ed', borderRadius: '10px', border: '1px solid #c2ebd0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#1e5e3a', fontWeight: 'bold' }}>Divergência / Quebra de Caixa</span>
                                <h3 style={{ color: '#28a745', margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Georgia', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MdCheckCircle style={{ fontSize: '1.1rem' }} /> R$ 0,00 (Perfeito)
                                </h3>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};