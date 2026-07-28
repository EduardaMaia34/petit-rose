import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from "./api";
import '../index.css';
import { MdWarning, MdInventory, MdAdd, MdDelete, MdEdit } from 'react-icons/md';

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
    insumoId: string; // Alinhado com o 'UUID insumoId' do seu DTO Java
    nomeInsumo: string;
    quantidadeAtual: number;
    capacidadeMaxima: number; // Alinhado com 'capacidadeMaxima' do DTO Java
    porcentagem: number;
    status: string;
    categoria?: string;
    unidade?: string;
}

export const ControleEstoque = () => {
    const [insumos, setInsumos] = useState<ItemEstoqueDTO[]>([]);
    const [loading, setLoading] = useState(false);

    // Estados de controle do Modal de Cadastro/Edição de Insumo
    const [isModalInsumoAberto, setIsModalInsumoAberto] = useState(false);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [capacidadeMax, setCapacidadeMax] = useState('');
    const [unidade, setUnidade] = useState('kg');
    const [categoria, setCategoria] = useState('');
    const [modoEdicao, setModoEdicao] = useState(false);
    const [itemEditando, setItemEditando] = useState<string | null>(null);

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
            await api.put(`/estoque/item/${id}`, {
                quantidadeAtual: novaQtd,
                capacidadeMaxima: itemAlvo.capacidadeMaxima
            });
        } catch (error) {
            console.error("Erro ao sincronizar ajuste de estoque:", error);
            carregarEstoqueCompleto();
        }
    };

    // 3. EXCLUSÃO DE INSUMO PELO INSUMOID CORRETO DO JAVA
    const handleExcluirInsumo = async (insumoId: string) => {
        console.log("ID que estou tentando excluir:", insumoId);
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Esta ação removerá o insumo permanentemente do estoque.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#710100',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, excluir!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/insumos/${insumoId}`);
                setInsumos(prev => prev.filter(i => i.insumoId !== insumoId));
                Swal.fire('Excluído!', 'O insumo foi removido com sucesso.', 'success');
                carregarEstoqueCompleto();
            } catch (error) {
                console.error("Erro ao excluir:", error);
                Swal.fire('Erro', 'Não foi possível excluir o insumo.', 'error');
            }
        }
    };

    // 4. ATIVAÇÃO DO MODO DE EDIÇÃO E PREENCHIMENTO DOS CAMPOS
    const handleEditarInsumo = (insumo: ItemEstoqueDTO) => {
        setModoEdicao(true);
        // 🔥 CORRIGIDO: Vincula o ID correto do Insumo para bater com a rota @PutMapping("/{id}") do Java
        setItemEditando(insumo.insumoId || insumo.id);

        setNome(insumo.nomeInsumo);
        setQuantidade(insumo.quantidadeAtual.toString());
        setCapacidadeMax(insumo.capacidadeMaxima.toString());
        setCategoria(insumo.categoria || '');
        setUnidade(insumo.unidade || 'kg');

        setIsModalInsumoAberto(true);
    };

    // Auxiliar para resetar estados ao fechar o modal com segurança
    const fecharModalInsumoLimpo = () => {
        setIsModalInsumoAberto(false);
        setModoEdicao(false);
        setItemEditando(null);
        setNome('');
        setQuantidade('');
        setCapacidadeMax('');
        setCategoria('');
        setUnidade('kg');
    };

    // 5. SALVAMENTO UNIFICADO (CADASTRO VS EDIÇÃO)
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

            // 💎 PAYLOAD CORRIGIDO: Mapeia as propriedades exatas que a entidade Insumo.java espera receber
            const payloadInsumo = {
                nome: nome,
                valorUnitario: 0.0,
                quantidadeAtual: parseInt(quantidade),
                capacidadeMaxima: parseInt(capacidadeMax),
                categoria: categoria, // Garante o envio da string ou ID selecionado
                unidade: unidade       // Garante o envio da unidade (kg, g, unid...)
            };

            if (modoEdicao && itemEditando) {
                // 🔥 EDIÇÃO: Envia para o controller de Insumos
                await api.put(`/insumos/${itemEditando}`, payloadInsumo);

                Swal.fire({
                    title: 'Insumo Atualizado!',
                    text: `O item "${nome}" foi editado com sucesso.`,
                    icon: 'success',
                    confirmButtonColor: '#710100'
                });
            } else {
                // CADASTRO: Envia para o controller de Insumos
                await api.post('/insumos', payloadInsumo);

                Swal.fire({
                    title: 'Insumo Cadastrado!',
                    text: `O item "${nome}" foi inserido com sucesso.`,
                    icon: 'success',
                    confirmButtonColor: '#710100'
                });
            }

            fecharModalInsumoLimpo();

            // 🔥 FORÇA UMA ATUALIZAÇÃO DO BANCO: Adicionado um pequeno delay de 300ms
            // para dar tempo do banco de dados MySQL consolidar o COMMIT do Spring Boot antes do recarregamento
            setTimeout(async () => {
                await carregarEstoqueCompleto();
            }, 300);

        } catch (error) {
            console.error("Erro ao salvar insumo:", error);
            Swal.fire({
                title: 'Erro',
                text: 'Não foi possível salvar as alterações do insumo no servidor.',
                icon: 'error',
                confirmButtonColor: '#710100'
            });
        } finally {
            setLoading(false);
        }
    };

    // Mapeamento dinâmico de cores com base nas regras do Estoque
    const obterCoresPorStatus = (statusTxt: string) => {
        if (statusTxt === 'Baixo Estoque' || statusTxt === 'Esgotado') {
            return { corTexto: '#ff4d4d', corFundo: '#fff1f1', corBarra: '#ff4d4d' };
        }
        if (statusTxt === 'Médio' || statusTxt === 'Baixo') {
            return { corTexto: '#710100', corFundo: '#fdf2f2', corBarra: '#710100' };
        }
        return { corTexto: '#28a745', corFundo: '#e6f7ed', corBarra: '#28a745' };
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="estoque" />

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
                            onClick={() => { setModoEdicao(false); setIsModalInsumoAberto(true); }}
                        >
                            <MdAdd style={{ fontSize: '1.1rem' }} /> Novo Insumo
                        </button>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', margin: '10px 0', color: '#710100', fontWeight: 'bold' }}>Sincronizando armazém...</div>
                    )}

                    {/* STATS CONTADORES */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '4px', marginBottom: '12px', width: '100%' }}>
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
                                <th style={{ textAlign: 'center' }}>Ações</th>
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

                                                <button
                                                    onClick={() => handleEditarInsumo(insumo)}
                                                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #0d6efd', backgroundColor: '#eef5ff', color: '#0d6efd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Editar Insumo"
                                                >
                                                    <MdEdit />
                                                </button>

                                                <button
                                                    onClick={() => handleExcluirInsumo(insumo.insumoId)}
                                                    style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ff4d4d', backgroundColor: '#fff1f1', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Excluir Insumo"
                                                >
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* 🔥 MODAL DINÂMICO DE CADASTRO / EDIÇÃO DE INSUMO */}
                    {isModalInsumoAberto && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(113, 1, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(3px)' }}>
                            <div className="report-container" style={{ backgroundColor: '#ffffff', padding: '30px', width: '500px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #f0e6e6' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MdInventory style={{ fontSize: '1.2rem', color: '#710100' }} />
                                        </div>
                                        {/* ✨ TEXTO DINÂMICO CONFORME O STATUS DE EDIÇÃO */}
                                        <h2 style={{ color: '#710100', margin: 0, fontFamily: 'Abhaya Libre', fontSize: '24px', fontWeight: 'bold' }}>
                                            {modoEdicao ? 'Editar Insumo Existente' : 'Cadastrar Novo Insumo'}
                                        </h2>
                                    </div>
                                    <button type="button" onClick={fecharModalInsumoLimpo} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
                                </div>

                                <form onSubmit={handleSalvarInsumo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Nome do Ingrediente *</label>
                                        <input type="text" placeholder="Ex: Chocolate em Pó Nestlé 50%" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} required />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Quantidade Atual *</label>
                                            <input type="number" placeholder="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} required />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Capacidade Máxima *</label>
                                            <input type="number" placeholder="Ex: 50" value={capacidadeMax} onChange={(e) => setCapacidadeMax(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} required />
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
                                            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', backgroundColor: '#fff' }} required>
                                                <option value="">Selecione...</option>
                                                {categoriasInsumo.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px', borderTop: '2px solid #fff1f1', paddingTop: '15px' }}>
                                        <button type="button" onClick={fecharModalInsumoLimpo} className="status-btn-em-preparo" style={{ backgroundColor: '#f5f5f5', color: '#6c757d', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                                        {/* ✨ BOTÃO REATIVO CONFORME O MODO DE EDIÇÃO */}
                                        <button type="submit" className="status-btn-pagamento" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                                            {modoEdicao ? 'Atualizar Dados' : 'Salvar Insumo'}
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