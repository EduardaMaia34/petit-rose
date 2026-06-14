import { useState, useEffect } from 'react';
import { api } from './api';
import { Navbar } from './Navbar';
import { FinalizarPedidoModal } from './FinalizarPedidoModal';
import Swal from 'sweetalert2';
import {  BiTrash } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom'; // 🔥 Importado para fazer o redirecionamento
import '../index.css';

export const NovoPedido = () => {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [comandas, setComandas] = useState<any[]>([]);
    const [itensPedido, setItensPedido] = useState<any[]>([]);

    const [comandaId, setComandaId] = useState('');
    const [prodSelecionado, setProdSelecionado] = useState('');
    const [qtd, setQtd] = useState(1);
    const [observacao, setObservacao] = useState('');

    const [mesaSelecionadaParaNovaComanda, setMesaSelecionadaParaNovaComanda] = useState('1');
    const [criandoComanda, setCriandoComanda] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate(); // 🔥 Inicializado o navegador de rotas

    const carregarComandasAtivas = async () => {
        try {
            const resComandas = await api.get('/comandas/ativas');
            setComandas(resComandas.data);
        } catch (error) {
            console.error("Erro ao carregar as comandas", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const resProd = await api.get('/produtos');
                setProdutos(resProd.data.filter((p: any) => p.catalogoAtivo || p.catalogo_ativo));
                await carregarComandasAtivas();
            } catch (error) {
                console.error("Erro ao carregar dados iniciais", error);
            }
        };
        loadData();
    }, []);

    const handleAbrirNovaComandaMesa = async () => {
        try {
            setCriandoComanda(true);
            const numeroMesaInt = parseInt(mesaSelecionadaParaNovaComanda);
            const comandasNaMesmaMesa = comandas.filter(c => c.numeroMesa === numeroMesaInt).length;

            const response = await api.post('/comandas', {
                numeroMesa: numeroMesaInt
            });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Comanda para Mesa ${numeroMesaInt} (Conta ${comandasNaMesmaMesa + 1}) aberta!`,
                showConfirmButton: false,
                timer: 2500
            });

            await carregarComandasAtivas();
            setComandaId(response.data.id);

        } catch (error) {
            Swal.fire('Erro', 'Não foi possível abrir uma comanda para esta mesa.', 'error');
        } finally {
            setCriandoComanda(false);
        }
    };

    const adicionarItem = () => {
        if (!prodSelecionado) return;
        const produto = produtos.find(p => p.id === prodSelecionado);
        if (!produto) return;

        const existente = itensPedido.find(i => i.id === produto.id && i.observacao === observacao);
        if (existente) {
            setItensPedido(itensPedido.map(i =>
                (i.id === produto.id && i.observacao === observacao)
                    ? { ...i, quantidade: i.quantidade + qtd }
                    : i
            ));
        } else {
            setItensPedido([...itensPedido, {
                id: produto.id,
                nome: produto.nome,
                quantidade: qtd,
                preco: produto.valor,
                observacao: observacao
            }]);
        }
        setProdSelecionado('');
        setQtd(1);
        setObservacao('');
    };

    const removerItemRascunho = (index: number) => {
        setItensPedido(itensPedido.filter((_, i) => i !== index));
    };

    const calcularTotal = () => itensPedido.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    const abrirFinalizacao = () => {
        if (!comandaId) {
            Swal.fire('Atenção', 'Selecione uma comanda ou abra uma nova antes de prosseguir!', 'warning');
            return;
        }
        if (itensPedido.length === 0) {
            Swal.fire('Atenção', 'Adicione pelo menos um doce ao pedido.', 'warning');
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />
            <div className="main-container">
                <h2 style={{ color: '#600000', fontFamily: 'Georgia, serif' }}>Lançar Pedido na Comanda</h2>

                <div className="form-produto-container" style={{ maxWidth: '100%', margin: '20px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '20px', alignItems: 'end' }}>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Selecione a Comanda Ativa *</label>
                            <select value={comandaId} onChange={(e) => setComandaId(e.target.value)} required>
                                <option value="">Escolha uma comanda ativa...</option>
                                {comandas.map((com) => (
                                    <option key={com.id} value={com.id}>
                                        Mesa {com.numeroMesa} (Ref: #{com.id.substring(0, 4)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0, borderLeft: '2px dashed #fbbfc5', paddingLeft: '20px' }}>
                            <label>Nova Comanda na Mesa:</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select value={mesaSelecionadaParaNovaComanda} onChange={(e) => setMesaSelecionadaParaNovaComanda(e.target.value)} style={{ width: '80px' }}>
                                    {[1,2,3,4,5,6,7,8,9].map(n => (
                                        <option key={n} value={n}>Mesa {n}</option>
                                    ))}
                                </select>
                                <button type="button" className="btn-padrao" onClick={handleAbrirNovaComandaMesa} disabled={criandoComanda} style={{ backgroundColor: '#600000', color: '#ffffe3', marginBottom: 0, flex: 1, height: '42px' }}>
                                    {criandoComanda ? 'Abrindo...' : '+ Abrir Conta'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr style={{ border: '1px dashed #fbbfc5', margin: '20px 0' }} />

                    <h3>Produtos</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 2fr auto', gap: '15px', alignItems: 'end' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Doce / Item</label>
                            <select value={prodSelecionado} onChange={(e) => setProdSelecionado(e.target.value)}>
                                <option value="">Escolha uma delícia da Petit Rose...</option>
                                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor.toFixed(2)}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Qtd.</label>
                            <input type="number" value={qtd} min="1" onChange={(e) => setQtd(parseInt(e.target.value) || 1)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Observação</label>
                            <input type="text" placeholder="Ex: Sem açúcar..." value={observacao} onChange={(e) => setObservacao(e.target.value)} />
                        </div>
                        <button className="btn-padrao" onClick={adicionarItem} style={{ marginBottom: '0', height: '45px' }}>
                            + Inserir
                        </button>
                    </div>

                    <div className="produtos-table-container" style={{ marginTop: '30px', border: '1px solid #fbbfc5', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="produtos-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#fff5f5', color: '#600000' }}>
                                <th style={{ padding: '12px' }}>Item</th>
                                <th style={{ padding: '12px' }}>Quantidade</th>
                                <th style={{ padding: '12px' }}>Preço Unitário</th>
                                <th style={{ padding: '12px' }}>Subtotal</th>
                                <th style={{ padding: '12px', textAlign: 'center', width: '80px' }}>Remover</th>
                            </tr>
                            </thead>
                            <tbody>
                            {itensPedido.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>Nenhum item inserido no rascunho.</td>
                                </tr>
                            ) : (
                                itensPedido.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #fff5f5' }}>
                                        <td style={{ padding: '12px' }}>
                                            <strong>{item.nome}</strong>
                                            {item.observacao && <span style={{ display: 'block', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>({item.observacao})</span>}
                                        </td>
                                        <td style={{ padding: '12px' }}>{item.quantidade}x</td>
                                        <td style={{ padding: '12px' }}>R$ {item.preco.toFixed(2)}</td>
                                        <td style={{ padding: '12px' }}><strong>R$ {(item.preco * item.quantidade).toFixed(2)}</strong></td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => removerItemRascunho(idx)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#c93b3b',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '5px'
                                                }}
                                            >
                                                <BiTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '20px', color: '#600000' }}>
                        <h3>Valor Total: R$ {calcularTotal().toFixed(2)}</h3>
                    </div>

                    {/* 🔥 BOTÕES INFERIORES: Adicionado o botão de Cancelar ao lado do de prosseguir */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
                        <button
                            type="button"
                            className="btn-padrao"
                            onClick={() => navigate('/pedidos')}
                            style={{
                                backgroundColor: '#600000', // Fundo transparente
                                color: '#fff8e6',               // Texto Vinho
                                border: '2px solid #600000',    // Borda Vinho
                                borderRadius: '10px',
                                padding: '15px 40px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontFamily: "'Georgia', serif",
                                marginBottom: 0
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn-padrao"
                            onClick={abrirFinalizacao}
                            style={{ padding: '15px 40px', fontSize: '16px', borderRadius: '10px', fontWeight: 'bold', fontFamily: "'Georgia', serif", marginBottom: 0 }}
                        >
                            Prosseguir para o Fechamento
                        </button>
                    </div>

                </div>
            </div>

            {isModalOpen && (
                <FinalizarPedidoModal
                    dados={{ comandaId, itens: itensPedido, total: calcularTotal() }}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};