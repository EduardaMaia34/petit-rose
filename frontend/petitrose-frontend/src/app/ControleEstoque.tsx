import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';
import { MdWarning, MdInventory, MdAdd } from 'react-icons/md';

// Categorias e Unidades padrões para uma confeitaria
const categoriasInsumo = [
    { id: 'Chocolates', nome: 'Chocolates' },
    { id: 'Secos', nome: 'Secos (Farinha, Açúcar, etc.)' },
    { id: 'Laticínios', nome: 'Laticínios' },
    { id: 'Frutas', nome: 'Frutas Frescas' },
    { id: 'Outros', nome: 'Outros' }
];

const unidadesMedida = ['kg', 'g', 'unid', 'L', 'ml'];

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

    // Estados de controle do Modal de Cadastro de Insumo
    const [isModalInsumoAberto, setIsModalInsumoAberto] = useState(false);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [unidade, setUnidade] = useState('kg');
    const [minimo, setMinimo] = useState('');
    const [categoria, setCategoria] = useState('');

    // Função para movimentação rápida (+1 ou -1)
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

    // Ajustado para usar Marrom (#710100) no crítico e Vermelho (#ff4d4d) no esgotado
    const obterStatusEstoque = (atual: number, minimo: number) => {
        if (atual === 0) return { texto: 'Esgotado', classe: 'status-pendente', corBarra: '#ff4d4d', corTexto: '#ff4d4d', corFundo: '#fff1f1' };
        if (atual <= minimo) return { texto: 'Crítico', classe: 'status-preparo', corBarra: '#710100', corTexto: '#710100', corFundo: '#fdf2f2' };
        return { texto: 'Normal', classe: 'status-pago', corBarra: '#28a745', corTexto: '#28a745', corFundo: '#e6f7ed' };
    };

    // Submissão do formulário do Modal
    const handleSalvarInsumo = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !quantidade || !unidade || !minimo || !categoria) {
            Swal.fire({
                title: 'Atenção!',
                text: 'Por favor, preencha todos os campos obrigatórios.',
                icon: 'warning',
                confirmButtonColor: '#710100'
            });
            return;
        }

        const novoInsumo = {
            id: insumos.length + 1,
            nome,
            quantidade: parseFloat(quantidade),
            unidade,
            minimo: parseFloat(minimo),
            categoria
        };

        // Adiciona o novo ingrediente no topo da lista
        setInsumos([novoInsumo, ...insumos]);

        Swal.fire({
            title: 'Insumo Cadastrado!',
            text: `O item "${nome}" foi inserido com sucesso na matéria-prima.`,
            icon: 'success',
            confirmButtonColor: '#710100'
        });

        // Reseta o formulário e fecha o modal
        setNome('');
        setQuantidade('');
        setUnidade('kg');
        setMinimo('');
        setCategoria('');
        setIsModalInsumoAberto(false);
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* 1. CABEÇALHO COMPACTADO - MARGEM ZERADA */}
                    <div className="dashboard-header" style={{ marginBottom: '0px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.9rem', fontWeight: 'bold', margin: '0' }}>Controle de Estoque</h1>
                            <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0' }}>Gerenciamento de matéria-prima e ingredientes para a produção da confeitaria.</p>
                        </div>
                        {/* CLIQUE AQUI ABRE O MODAL */}
                        <button
                            className="btn btn-sm"
                            style={{ backgroundColor: '#710100', color: '#fff', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', border: 'none' }}
                            onClick={() => setIsModalInsumoAberto(true)}
                        >
                            <MdAdd style={{ fontSize: '1.1rem' }} /> Novo Insumo
                        </button>
                    </div>

                    {/* 2. STATS CONTAINER APROXIMADO DO CABEÇALHO E DA TABELA */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '4px', marginBottom: '12px', width: '100%' }}>

                        {/* Card: Itens Críticos */}
                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '46px', height: '46px', minHeight: '46px', minWidth: '46px', borderRadius: '50%', backgroundColor: '#fff1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
                                <MdWarning style={{ fontSize: '1.5rem', color: '#ff4d4d' }} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>Estoque Crítico / Baixo</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#710100', margin: '2px 0 0 0', fontFamily: 'Georgia' }}>
                                    {insumos.filter(i => i.quantidade <= i.minimo).length} Insumos
                                </h2>
                            </div>
                        </div>

                        {/* Card: Total Cadastrado */}
                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '46px', height: '46px', minHeight: '46px', minWidth: '46px', borderRadius: '50%', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
                                <MdInventory style={{ fontSize: '1.5rem', color: '#28a745' }} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>Total de Itens Cadastrados</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#28a745', margin: '2px 0 0 0', fontFamily: 'Georgia' }}>
                                    {insumos.length} Ingredientes
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* 3. TABELA COM ESPAÇAMENTOS INTERNOS REDUZIDOS */}
                    <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <div className="container-header" style={{ marginBottom: '8px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                            <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '24px' }}>Lista de Matérias-Primas</h2>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #fff1f1', color: '#6c757d', fontSize: '0.9rem' }}>
                                <th style={{ padding: '8px 5px' }}>Ingrediente</th>
                                <th>Categoria</th>
                                <th>Qtd Atual</th>
                                <th>Mínimo Ideal</th>
                                <th>Status / Nível</th>
                                <th style={{ textAlign: 'center' }}>Ajuste Rápido</th>
                            </tr>
                            </thead>
                            <tbody>
                            {insumos.map((insumo) => {
                                const status = obterStatusEstoque(insumo.quantidade, insumo.minimo);
                                const porcentagemVisivel = Math.min(100, (insumo.quantidade / (insumo.minimo * 2)) * 100);

                                return (
                                    <tr key={insumo.id} style={{ borderBottom: '1px solid #fff1f1', fontSize: '0.95rem' }}>
                                        <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#3c1010' }}>{insumo.nome}</td>
                                        <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>{insumo.categoria}</td>
                                        <td>
                                            <span style={{ fontWeight: 'bold', color: '#710100' }}>{insumo.quantidade}</span> <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>{insumo.unidade}</span>
                                        </td>
                                        <td style={{ color: '#6c757d' }}>{insumo.minimo} {insumo.unidade}</td>
                                        <td style={{ width: '200px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    minWidth: '70px',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    backgroundColor: status.corFundo,
                                                    color: status.corTexto
                                                }}>
                                                    {status.texto}
                                                </span>
                                                <div style={{ width: '60px', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${porcentagemVisivel}%`, height: '100%', backgroundColor: status.corBarra }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleQuickAjuste(insumo.id, 'subtrair')}
                                                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#ffffff', color: '#6c757d', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => handleQuickAjuste(insumo.id, 'somar')}
                                                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #28a745', backgroundColor: '#f9fdfa', color: '#28a745', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
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

                    {/* ----------------- 🛠️ MODAL DE CADASTRO DE INSUMO INTEGRADO NO PADRÃO PETIT ROSE ----------------- */}
                    {isModalInsumoAberto && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(113, 1, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(3px)' }}>
                            <div className="report-container" style={{ backgroundColor: '#ffffff', padding: '30px', width: '500px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(113, 1, 0, 0.15)', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #f0e6e6' }}>

                                {/* Header do Modal */}
                                {/* Header do Modal - Atualizado para o Padrão de Ícones */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {/* Círculo do Ícone perfeitamente centralizado */}
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
                                            <MdInventory style={{ fontSize: '1.2rem', color: '#710100', display: 'block' }} />
                                        </div>
                                        <h2 style={{ color: 'var(--vinho-texto)', margin: 0, fontFamily: 'Abhaya Libre', fontSize: '24px', fontWeight: 'bold' }}>
                                            Cadastrar Novo Insumo
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalInsumoAberto(false)}
                                        style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6c757d', transition: '0.2s' }}
                                    >
                                        &times;
                                    </button>
                                </div>
                                {/* Formulário de Cadastro */}
                                <form onSubmit={handleSalvarInsumo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                                    {/* Nome do Ingrediente */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Nome do Ingrediente *</label>
                                        <input type="text" placeholder="Ex: Chocolate em Pó Nestlé 50%" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                    </div>

                                    {/* Quantidade Inicial e Unidade de Medida */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Quantidade Atual *</label>
                                            <input type="number" step="0.01" placeholder="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Unidade de Medida *</label>
                                            <select value={unidade} onChange={(e) => setUnidade(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', backgroundColor: '#fff', color: '#495057' }}>
                                                {unidadesMedida.map((un) => <option key={un} value={un}>{un}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Quantidade Mínima Crítica */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Estoque Mínimo Ideal *</label>
                                        <input type="number" step="0.01" placeholder="Aviso de estoque crítico se atingir este valor" value={minimo} onChange={(e) => setMinimo(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                    </div>

                                    {/* Categoria do Insumo */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Categoria *</label>
                                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', backgroundColor: '#fff', color: '#495057' }}>
                                            <option value="">Selecione uma categoria...</option>
                                            {categoriasInsumo.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                                        </select>
                                    </div>

                                    {/* Botões de Ação do Rodapé */}
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px', borderTop: '2px solid #fff1f1', paddingTop: '15px' }}>
                                        <button type="button" onClick={() => setIsModalInsumoAberto(false)} className="status-btn-em-preparo" style={{ backgroundColor: '#f5f5f5', color: '#6c757d', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="status-btn-pagamento" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                            Salvar Insumo
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};