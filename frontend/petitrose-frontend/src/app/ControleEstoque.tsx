import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from "./api";
import '../index.css';
import { MdWarning, MdInventory, MdAdd } from 'react-icons/md';

// Categorias e Unidades padrões mantidas para o formulário de cadastro local
const categoriasInsumo = [
    { id: 'Chocolates', nome: 'Chocolates' },
    { id: 'Secos', nome: 'Secos (Farinha, Açúcar, etc.)' },
    { id: 'Laticínios', nome: 'Laticínios' },
    { id: 'Frutas', nome: 'Frutas Frescas' },
    { id: 'Outros', nome: 'Outros' }
];

const unidadesMedida = ['kg', 'g', 'unid', 'L', 'ml'];

// Interface atualizada para espelhar perfeitamente o ItemEstoqueResponseDTO do Java
interface ItemEstoqueDTO {
    id: string; // ID do ItemEstoque (UUID)
    insumoId: string; // ✨ CORRIGIDO: Alinhado com o 'UUID insumoId' do seu DTO Java
    nomeInsumo: string;
    quantidadeAtual: number;
    capacidadeMaxima: number; // ✨ CORRIGIDO: Alinhado com 'capacidadeMaxima' do DTO Java
    porcentagem: number;
    status: string;
    categoria?: string;
    unidade?: string;
}

export const ControleEstoque = () => {
    const [insumos, setInsumos] = useState<ItemEstoqueDTO[]>([]);
    const [loading, setLoading] = useState(false);

    // Estados de controle do Modal de Cadastro de Insumo
    const [isModalInsumoAberto, setIsModalInsumoAberto] = useState(false);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [capacidadeMax, setCapacidadeMax] = useState('');
    const [unidade, setUnidade] = useState('kg');
    const [categoria, setCategoria] = useState('');

    // 1. CARREGAMENTO DOS INSUMOS REAIS DO BANCO DE DADOS
    const carregarEstoqueCompleto = async () => {
        try {
            setLoading(true);
            const response = await api.get('/estoque');
            setInsumos(response.data);
        } catch (error) {
            console.error("Erro ao carregar estoque do back-end:", error);
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível ler as matérias-primas.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarEstoqueCompleto();
    }, []);

    // 2. FUNÇÃO DE AJUSTE RÁPIDO INTEGRADA À API DO JAVA (PUT)
    const handleQuickAjuste = async (id: string, operacao: 'somar' | 'subtrair') => {
        const itemAlvo = insumos.find(i => i.id === id);
        if (!itemAlvo) return;

        const novaQtd = operacao === 'somar' ? itemAlvo.quantidadeAtual + 1 : Math.max(0, itemAlvo.quantidadeAtual - 1);

        // Atualização visual reativa imediata na tela
        setInsumos(prev => prev.map(item => {
            if (item.id === id) {
                const novaPorcentagem = item.capacidadeMaxima > 0 ? (novaQtd / item.capacidadeMaxima) * 100 : 0;
                let novoStatus = "Cheio";
                if (novaPorcentagem <= 25) novoStatus = "Baixo Estoque";
                else if (novaPorcentagem <= 50) novoStatus = "Médio";

                return { ...item, quantidadeAtual: novaQtd, porcentagem: novaPorcentagem, status: novoStatus };
            }
            return item;
        }));

        try {
            // Envia as propriedades corretas esperadas pelo objeto ItemEstoque do Java
            await api.put(`/estoque/item/${id}`, {
                quantidadeAtual: novaQtd,
                capacidadeMaxima: itemAlvo.capacidadeMaxima
            });
        } catch (error) {
            console.error("Erro ao sincronizar ajuste de estoque:", error);
            carregarEstoqueCompleto();
        }
    };

    // Mapeamento dinâmico de cores com base nas regras do EstoqueService do Java
    const obterCoresPorStatus = (statusTxt: string) => {
        if (statusTxt === 'Baixo Estoque' || statusTxt === 'Esgotado') {
            return { corTexto: '#ff4d4d', corFundo: '#fff1f1', corBarra: '#ff4d4d' };
        }
        if (statusTxt === 'Médio' || statusTxt === 'Baixo') {
            return { corTexto: '#710100', corFundo: '#fdf2f2', corBarra: '#710100' };
        }
        return { corTexto: '#28a745', corFundo: '#e6f7ed', corBarra: '#28a745' };
    };

    // 3. CADASTRO DE INSUMO SINCRONIZANDO O FLUXO DUPLO DO BACKEND
    const handleSalvarInsumo = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !quantidade || !capacidadeMax || !categoria) {
            Swal.fire({
                title: 'Atenção!',
                text: 'Por favor, preencha todos os campos obrigatórios.',
                icon: 'warning',
                confirmButtonColor: '#710100'
            });
            return;
        }

        try {
            setLoading(true);

            // Passo 1: Cria o insumo base em /insumos (o InsumoService vai rodar a trigger e gerar o ItemEstoque zerado)
            const resInsumo = await api.post('/insumos', {
                nome: nome,
                valorUnitario: 0.0 // Alinhado com a propriedade float da sua entidade Insumo.java
            });

            const novoInsumoId = resInsumo.data.id;

            // Passo 2: Recarrega a lista de estoque para pescar a linha gerada automaticamente pela Mari
            const resEstoqueAtualizado = await api.get('/estoque');
            const listaItensEstoque: ItemEstoqueDTO[] = resEstoqueAtualizado.data;

            // ✨ CORRIGIDO: Agora buscando cruzando a chave com 'insumoId' idêntico ao Record do Java
            const linhaEstoqueGerada = listaItensEstoque.find(item => item.insumoId === novoInsumoId);

            // Passo 3: Tendo o ID correto da linha do estoque, faz o PUT atualizando as quantidades reais
            if (linhaEstoqueGerada) {
                await api.put(`/estoque/item/${linhaEstoqueGerada.id}`, {
                    quantidadeAtual: parseInt(quantidade),
                    capacidadeMaxima: parseInt(capacidadeMax) // ✨ CORRIGIDO: Alinhado com a propriedade do back
                });

                Swal.fire({
                    title: 'Insumo Cadastrado!',
                    text: `O item "${nome}" foi inserido com sucesso com saldo inicial.`,
                    icon: 'success',
                    confirmButtonColor: '#710100'
                });
            } else {
                throw new Error("Não foi possível localizar o vínculo de estoque para este insumo.");
            }

            setNome('');
            setQuantidade('');
            setCapacidadeMax('');
            setCategoria('');
            setIsModalInsumoAberto(false);
            carregarEstoqueCompleto();
        } catch (error) {
            console.error("Erro ao cadastrar novo insumo completo:", error);
            Swal.fire('Erro', 'Não foi possível salvar o insumo e suas quantidades.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* CABEÇALHO CONTROLE ESTOQUE */}
                    <div className="dashboard-header" style={{ marginBottom: '0px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.9rem', fontWeight: 'bold', margin: '0' }}>Controle de Estoque</h1>
                            <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0' }}>Gerenciamento de matéria-prima e ingredientes para a produção da confeitaria.</p>
                        </div>
                        <button
                            className="btn btn-sm"
                            style={{ backgroundColor: '#710100', color: '#fff', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', border: 'none' }}
                            onClick={() => setIsModalInsumoAberto(true)}
                        >
                            <MdAdd style={{ fontSize: '1.1rem' }} /> Novo Insumo
                        </button>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', margin: '10px 0', color: '#710100', fontWeight: 'bold' }}>Sincronizando armazém...</div>
                    )}

                    {/* STATS CONTADORES */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '4px', marginBottom: '12px', width: '100%' }}>

                        {/* Baixo Estoque */}
                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#fff1f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MdWarning style={{ fontSize: '1.5rem', color: '#ff4d4d' }} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>Estoque Crítico / Baixo</span>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#710100', margin: '2px 0 0 0', fontFamily: 'Georgia' }}>
                                    {insumos.filter(i => i.status === 'Baixo Estoque' || i.status === 'Esgotado').length} Insumos
                                </h2>
                            </div>
                        </div>

                        {/* Total Cadastrado */}
                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

                    {/* TABELA DE MATÉRIAS-PRIMAS */}
                    <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <div className="container-header" style={{ marginBottom: '8px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                            <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '24px' }}>Lista de Matérias-Primas</h2>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #fff1f1', color: '#6c757d', fontSize: '0.9rem' }}>
                                <th style={{ padding: '8px 5px' }}>Ingrediente</th>
                                <th>Qtd Atual</th>
                                <th>Capacidade Máx</th>
                                <th>Nível do Estoque</th>
                                <th style={{ textAlign: 'center' }}>Ajuste Rápido</th>
                            </tr>
                            </thead>
                            <tbody>
                            {insumos.map((insumo) => {
                                const coresStatus = obterCoresPorStatus(insumo.status);

                                return (
                                    <tr key={insumo.id} style={{ borderBottom: '1px solid #fff1f1', fontSize: '0.95rem' }}>
                                        <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#3c1010' }}>{insumo.nomeInsumo}</td>
                                        <td>
                                            <span style={{ fontWeight: 'bold', color: '#710100' }}>{insumo.quantidadeAtual}</span> <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>{insumo.unidade || 'unid'}</span>
                                        </td>
                                        <td style={{ color: '#6c757d' }}>{insumo.capacidadeMaxima} {insumo.unidade || 'unid'}</td>
                                        <td style={{ width: '220px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    minWidth: '95px',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    backgroundColor: coresStatus.corFundo,
                                                    color: coresStatus.corTexto
                                                }}>
                                                    {insumo.status}
                                                </span>
                                                <div style={{ width: '60px', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${Math.min(100, insumo.porcentagem)}%`, height: '100%', backgroundColor: coresStatus.corBarra }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleQuickAjuste(insumo.id, 'subtrair')}
                                                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#ffffff', color: '#6c757d', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => handleQuickAjuste(insumo.id, 'somar')}
                                                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #28a745', backgroundColor: '#f9fdfa', color: '#28a745', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

                    {/* MODAL DE CADASTRO DE INSUMO */}
                    {isModalInsumoAberto && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(113, 1, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(3px)' }}>
                            <div className="report-container" style={{ backgroundColor: '#ffffff', padding: '30px', width: '500px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #f0e6e6' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MdInventory style={{ fontSize: '1.2rem', color: '#710100' }} />
                                        </div>
                                        <h2 style={{ color: '#710100', margin: 0, fontFamily: 'Abhaya Libre', fontSize: '24px', fontWeight: 'bold' }}>Cadastrar Novo Insumo</h2>
                                    </div>
                                    <button type="button" onClick={() => setIsModalInsumoAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
                                    end
                                </div>

                                <form onSubmit={handleSalvarInsumo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Nome do Ingrediente *</label>
                                        <input type="text" placeholder="Ex: Chocolate em Pó Nestlé 50%" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Quantidade Atual *</label>
                                            <input type="number" placeholder="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Capacidade Máxima *</label>
                                            <input type="number" placeholder="Ex: 50" value={capacidadeMax} onChange={(e) => setCapacidadeMax(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Unidade de Medida *</label>
                                            <select value={unidade} onChange={(e) => setUnidade(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', backgroundColor: '#fff' }}>
                                                {unidadesMedida.map((un) => <option key={un} value={un}>{un}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Categoria *</label>
                                            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', backgroundColor: '#fff' }}>
                                                <option value="">Selecione...</option>
                                                {categoriasInsumo.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px', borderTop: '2px solid #fff1f1', paddingTop: '15px' }}>
                                        <button type="button" onClick={() => setIsModalInsumoAberto(false)} className="status-btn-em-preparo" style={{ backgroundColor: '#f5f5f5', color: '#6c757d', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                                        <button type="submit" className="status-btn-pagamento" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Salvar Insumo</button>
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