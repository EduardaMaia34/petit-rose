import React, { useState, useEffect } from 'react';
import { api } from './api';
import { Navbar } from './Navbar';
import { FinalizarPedidoModal } from './FinalizarPedidoModal';
import Swal from 'sweetalert2';
import '../index.css';

export const NovoPedido = () => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [comandas, setComandas] = useState<any[]>([]);
    const [itensPedido, setItensPedido] = useState<any[]>([]);

    const [clienteId, setClienteId] = useState('');
    const [comandaId, setComandaId] = useState('');
    const [prodSelecionado, setProdSelecionado] = useState('');
    const [qtd, setQtd] = useState(1);

    // Estado para controlar o número da mesa selecionada para abrir a comanda
    const [mesaSelecionadaParaNovaComanda, setMesaSelecionadaParaNovaComanda] = useState('1');
    const [criandoComanda, setCriandoComanda] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                const [resCli, resProd] = await Promise.all([
                    api.get('/usuarios'),
                    api.get('/produtos')
                ]);
                setClientes(resCli.data);
                setProdutos(resProd.data.filter((p: any) => p.catalogoAtivo || p.catalogo_ativo));
                await carregarComandasAtivas();
            } catch (error) {
                console.error("Erro ao carregar dados iniciais", error);
            }
        };
        loadData();
    }, []);

    // 🔥 FUNÇÃO ATUALIZADA: Abre uma nova comanda permitindo repetir o número da mesa
    const handleAbrirNovaComandaMesa = async () => {
        try {
            setCriandoComanda(true);
            const numeroMesaInt = parseInt(mesaSelecionadaParaNovaComanda);

            // Conta quantas comandas já estão ativas nessa mesa para dar um apelido visual amigável no log
            const comandasNaMesmaMesa = comandas.filter(c => c.numeroMesa === numeroMesaInt).length;

            const response = await api.post('/comandas', {
                numeroMesa: numeroMesaInt // Envia o Integer esperado por Comanda.java
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
            setComandaId(response.data.id); // Pré-seleciona a comanda que acabou de ser criada

        } catch (error) {
            Swal.fire('Erro', 'Não foi possível abrir uma comanda para esta mesa.', 'error');
        } finally {
            setCriandoComanda(false);
        }
    };

    const adicionarItem = () => {
        const produto = produtos.find(p => p.id === prodSelecionado);
        if (!produto) return;

        const existente = itensPedido.find(i => i.id === produto.id);
        if (existente) {
            setItensPedido(itensPedido.map(i => i.id === produto.id ? { ...i, quantidade: i.quantidade + qtd } : i));
        } else {
            setItensPedido([...itensPedido, { id: produto.id, nome: produto.nome, quantidade: qtd, preco: produto.valor }]);
        }
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
                <h2 style={{ color: '#600000', fontFamily: 'Abhaya Libre, serif' }}>Lançar Pedido na Comanda</h2>

                <div className="form-produto-container" style={{ maxWidth: '100%', margin: '20px 0' }}>

                    {/* SEÇÃO PRINCIPAL DE COMANDAS: SELECIONAR OU CRIAR */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '20px', alignItems: 'end' }}>

                        {/* 1. DROPDOWN DE COMANDAS ATIVAS */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Selecione a Comanda Ativa *</label>
                            <select value={comandaId} onChange={(e) => setComandaId(e.target.value)} required>
                                <option value="">Escolha uma comanda ativa...</option>
                                {comandas.map((com, index) => (
                                    <option key={com.id} value={com.id}>
                                        Mesa {com.numeroMesa} (Ref: #{com.id.substring(0, 4)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. CONTROLADOR PARA CRIAR NOVA COMANDA NA MESA */}
                        <div className="form-group" style={{ marginBottom: 0, borderLeft: '2px dashed #fbbfc5', paddingLeft: '20px' }}>
                            <label>Nova Comanda na Mesa:</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select
                                    value={mesaSelecionadaParaNovaComanda}
                                    onChange={(e) => setMesaSelecionadaParaNovaComanda(e.target.value)}
                                    style={{ width: '80px' }}
                                >
                                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => (
                                        <option key={n} value={n}>Mesa {n}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn-padrao"
                                    onClick={handleAbrirNovaComandaMesa}
                                    disabled={criandoComanda}
                                    style={{ backgroundColor: '#600000', color: '#ffffe3', marginBottom: 0, flex: 1, height: '42px' }}
                                >
                                    {criandoComanda ? 'Abrindo...' : '+ Abrir Conta'}
                                </button>
                            </div>
                        </div>

                        {/* 3. SELEÇÃO DO CLIENTE */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Cliente (Opcional)</label>
                            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                                <option value="">Selecione o Cliente...</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome || c.user}</option>)}
                            </select>
                        </div>
                    </div>

                    <hr style={{ border: '1px dashed #fbbfc5', margin: '20px 0' }} />

                    <h3>Produtos</h3>
                    <div className="content-wrapper" style={{ gridTemplateColumns: '3fr 1fr 1fr', gap: '15px', alignItems: 'end' }}>
                        <div className="form-group">
                            <label>Doce / Item</label>
                            <select value={prodSelecionado} onChange={(e) => setProdSelecionado(e.target.value)}>
                                <option value="">Escolha uma delícia da Petit Rose...</option>
                                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor.toFixed(2)}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Qtd.</label>
                            <input type="number" value={qtd} min="1" onChange={(e) => setQtd(parseInt(e.target.value))} />
                        </div>
                        <button className="btn-padrao" onClick={adicionarItem} style={{ marginBottom: '0', height: '45px' }}>
                            + Inserir
                        </button>
                    </div>

                    <div className="produtos-table-container" style={{ marginTop: '30px' }}>
                        <table className="produtos-table">
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantidade</th>
                                <th>Preço Unitário</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {itensPedido.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.nome}</td>
                                    <td>{item.quantidade}x</td>
                                    <td>R$ {item.preco.toFixed(2)}</td>
                                    <td><strong>R$ {(item.preco * item.quantidade).toFixed(2)}</strong></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '20px', color: '#600000' }}>
                        <h3>Valor Total: R$ {calcularTotal().toFixed(2)}</h3>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn-padrao" style={{ padding: '15px 50px', fontSize: '16px' }} onClick={abrirFinalizacao}>
                            Prosseguir para o Fechamento
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <FinalizarPedidoModal
                    dados={{ clienteId, comandaId, itens: itensPedido, total: calcularTotal() }}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};