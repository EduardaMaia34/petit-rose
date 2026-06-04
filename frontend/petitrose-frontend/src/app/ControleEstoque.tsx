import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';

// 1. MOCK DATA (Dados iniciais simulados para os insumos da confeitaria)
const insumosIniciais = [
    { id: 1, nome: 'Chocolate Meio Amargo Sicao', quantidade: 12, unidade: 'kg', minimo: 5, categoria: 'Chocolates' },
    { id: 2, nome: 'Farinha de Trigo Suprema', quantidade: 3, unidade: 'kg', minimo: 10, categoria: 'Secos' },
    { id: 3, nome: 'Morango Fresco (Bandeja)', quantidade: 2, unidade: 'unid', minimo: 6, categoria: 'Frutas' },
    { id: 4, nome: 'Leite Condensado Moça', quantidade: 24, unidade: 'unid', minimo: 12, categoria: 'Laticínios' },
    { id: 5, nome: 'Açúcar de Confeiteiro Glaçúcar', quantidade: 7, unidade: 'kg', minimo: 4, categoria: 'Secos' },
    { id: 6, nome: 'Creme de Leite Nestlé', quantidade: 5, unidade: 'unid', minimo: 12, categoria: 'Laticínios' },
];

export const ControleEstoque = () => {
    const navigate = useNavigate();
    const [insumos, setInsumos] = useState(insumosIniciais);

    // Função simulada para adicionar movimentação rápida (Ex: +5kg ou -2unid)
    const handleQuickAjuste = (id: number, operacao: 'somar' | 'subtrair') => {
        setInsumos(prevInsumos =>
            prevInsumos.map(insumo => {
                if (insumo.id === id) {
                    const novaQtd = operacao === 'somar' ? insumo.quantidade + 1 : Math.max(0, insumo.quantidade - 1);
                    return { ...insumo, quantidade: novaQtd };
                }
                return insumo;
            })
        );
    };

    // Função auxiliar para definir o status visual do estoque com base no limite mínimo
    const obterStatusEstoque = (atual: number, minimo: number) => {
        if (atual === 0) return { texto: 'Esgotado', classe: 'status-pendente', corBarra: '#ff4d4d' }; // Usa vermelho do pendente
        if (atual <= minimo) return { texto: 'Crítico', classe: 'status-preparo', corBarra: '#fcc419' }; // Usa amarelo do preparo
        return { texto: 'Normal', classe: 'status-pago', corBarra: '#28a745' }; // Usa verde do pago
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div className="content-wrapper">

                    {/* CABEÇALHO */}
                    <div className="dashboard-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.8rem' }}>Controle de Estoque (Insumos) 📦</h1>
                            <p style={{ color: '#6c757d' }}>Gerenciamento de matéria-prima e ingredientes para a produção da confeitaria.</p>
                        </div>
                        <button className="btn btn-sm" onClick={() => Swal.fire({ title: 'Aviso', text: 'Tela de cadastro de novo insumo será integrada na próxima etapa!', icon: 'info', confirmButtonColor: '#710100' })}>
                            + Cadastrar Insumo
                        </button>
                    </div>

                    {/* CARDS DE ALERTA RÁPIDO */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                        <div className="stat-box" style={{ padding: '15px', borderLeft: '5px solid #ff4d4d' }}>
                            <h3>Itens Críticos / Estoque Baixo ⚠️</h3>
                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#710100', marginTop: '5px' }}>
                                {insumos.filter(i => i.quantidade <= i.minimo).length} Insumos
                            </p>
                        </div>
                        <div className="stat-box" style={{ padding: '15px', borderLeft: '5px solid #28a745' }}>
                            <h3>Total de Itens Cadastrados</h3>
                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#28a745', marginTop: '5px' }}>
                                {insumos.length} Ingredientes
                            </p>
                        </div>
                    </div>

                    {/* TABELA DE INSUMOS */}
                    <div className="report-container" style={{ padding: '20px' }}>
                        <div className="container-header" style={{ marginBottom: '15px' }}>
                            <h2>Lista de Matérias-Primas</h2>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #f5f5f5', color: '#6c757d', fontSize: '0.9rem' }}>
                                <th style={{ padding: '10px 5px' }}>Ingrediente</th>
                                <th>Categoria</th>
                                <th>Qtd Atual</th>
                                <th>Qtd Mínima Ideal</th>
                                <th>Nível</th>
                                <th style={{ textAlign: 'center' }}>Ajuste Rápido</th>
                            </tr>
                            </thead>
                            <tbody>
                            {insumos.map((insumo) => {
                                const status = obterStatusEstoque(insumo.quantidade, insumo.minimo);
                                // Cálculo simples de porcentagem visual para a barra de progresso (limitado a 100%)
                                const porcentagemVisivel = Math.min(100, (insumo.quantidade / (insumo.minimo * 2)) * 100);

                                return (
                                    <tr key={insumo.id} style={{ borderBottom: '1px solid #fdfdfd', fontSize: '0.95rem' }}>
                                        <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{insumo.nome}</td>
                                        <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>{insumo.categoria}</td>
                                        <td>
                                            <span style={{ fontWeight: 'bold', color: '#710100' }}>{insumo.quantidade}</span> {insumo.unidade}
                                        </td>
                                        <td style={{ color: '#6c757d' }}>{insumo.minimo} {insumo.unidade}</td>
                                        <td style={{ width: '180px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span className={`status-badge ${status.classe}`} style={{ fontSize: '0.75rem', minWidth: '60px', textAlign: 'center' }}>
                                                        {status.texto}
                                                    </span>
                                                {/* Barra visual de nível */}
                                                <div style={{ width: '60px', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${porcentagemVisivel}%`, height: '100%', backgroundColor: status.corBarra }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => handleQuickAjuste(insumo.id, 'subtrair')}
                                                    style={{ padding: '2px 8px', backgroundColor: '#6c757d' }}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => handleQuickAjuste(insumo.id, 'somar')}
                                                    style={{ padding: '2px 8px', backgroundColor: '#28a745' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};