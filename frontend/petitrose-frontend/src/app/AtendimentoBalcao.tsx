import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from './api';
import '../index.css';
import { MdFlashOn, MdShoppingBasket } from 'react-icons/md';

interface Categoria {
    id: string;
    nome?: string;
    name?: string;
}

interface ProdutoCatalogo {
    id: string;
    nome: string;
    valor: number;
    descricao: string;
    imagemUrl: string;
    categoria?: Categoria;
    categoriaId?: string;
    catalogoAtivo: boolean;
}

interface ItemCarrinho {
    id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

export const AtendimentoBalcao = () => {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
    const [carregando, setCarregando] = useState<boolean>(true);
    const [metodoPagamento, setMetodoPagamento] = useState('PIX');

    // 1. CARREGAR VITRINE DO BANCO DE DADOS
    const buscarDados = async () => {
        try {
            setCarregando(true);
            const [responseProdutos, responseCategorias] = await Promise.all([
                api.get('/produtos'),
                api.get('/categorias')
            ]);

            // Exibir apenas produtos que estão marcados como ativos no catálogo
            const ativos = responseProdutos.data.filter((p: ProdutoCatalogo) => p.catalogoAtivo);
            setProdutos(ativos);
            setCategorias(responseCategorias.data);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os doces do catálogo.',
                icon: 'error',
                confirmButtonColor: '#710100'
            });
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarDados();
    }, []);

    // 2. OPERAÇÕES DO CARRINHO (ADICIONAR, ADICIONAR MAIS E REMOVER)
    const handleAdicionarAoCarrinho = (produto: ProdutoCatalogo) => {
        setCarrinho(prev => {
            const existente = prev.find(item => item.id === produto.id);
            if (existente) {
                return prev.map(item =>
                    item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
                );
            }
            return [...prev, { id: produto.id, nome: produto.nome, preco: produto.valor, quantidade: 1 }];
        });
    };

    const handleAlterarQuantidade = (id: string, operacao: 'somar' | 'subtrair') => {
        setCarrinho(prev =>
            prev.map(item => {
                if (item.id !== id) return item;
                const novaQtd = operacao === 'somar' ? item.quantidade + 1 : item.quantidade - 1;
                return { ...item, quantidade: novaQtd };
            }).filter(item => item.quantidade > 0)
        );
    };

    const totalPedido = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    // 3. INTEGRAR INTEGRAÇÃO ASSÍNCRONA COM O BACKEND DA MARI
    const handleFinalizarVenda = async () => {
        if (carrinho.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Carrinho vazio',
                text: 'Selecione pelo menos um item antes de finalizar.',
                confirmButtonColor: '#710100'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Confirmar Venda Rápida?',
            html: `<strong>Total:</strong> R$ ${totalPedido.toFixed(2).replace('.', ',')}<br/><strong>Forma de Pagamento:</strong> ${metodoPagamento}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#710100',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Confirmar e Pagar',
            cancelButtonText: 'Voltar'
        });

        if (!result.isConfirmed) return;

        try {
            setCarregando(true);

            // Abre uma comanda rápida fictícia de balcão (Mesa 99)
            const responseComanda = await api.post('/comandas', { numeroMesa: 99 });
            const comandaId = responseComanda.data.id;

            // Envia o payload no DTO exato mapeado no PedidoController
            const pedidoDTO = {
                itens: carrinho.map(item => ({
                    produtoId: item.id,
                    quantidade: item.quantidade,
                    observacao: `Atendimento ao Balcão (${metodoPagamento})`
                }))
            };

            // Salva o pedido na comanda recém-criada
            await api.post(`/pedidos/comanda/${comandaId}`, pedidoDTO);

            // Liquida a comanda fechando o caixa e salvando nos relatórios
            await api.put(`/comandas/${comandaId}/fechar?metodoPagamento=${metodoPagamento}`);

            Swal.fire({
                icon: 'success',
                title: 'Venda Concluída!',
                text: 'O pedido foi faturado e salvo no fluxo de caixa.',
                confirmButtonColor: '#710100'
            });

            setCarrinho([]);
            setMetodoPagamento('PIX');
            setCategoriaAtiva('Todos');

        } catch (error) {
            console.error("Erro no faturamento do balcão:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro na Operação',
                text: 'Não foi possível registrar o pedido no banco de dados.',
                confirmButtonColor: '#710100'
            });
        } finally {
            setCarregando(false);
        }
    };

    // Filtragem dinâmica de exibição baseada nas abas
    const produtosFiltrados = categoriaAtiva === 'Todos'
        ? produtos
        : produtos.filter(p => p.categoria?.id === categoriaAtiva || p.categoriaId === categoriaAtiva);

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>

                    {/* COLUNA ESQUERDA: VITRINE DE PRODUTOS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        {/* CABEÇALHO DA VITRINE ULTRA COMPACTO */}
                        <div className="report-container" style={{ padding: '15px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', marginBottom: '0px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
                                    <MdFlashOn style={{ fontSize: '1.2rem', color: '#ff4d4d' }} />
                                </div>
                                <h1 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre, serif', fontSize: '24px', fontWeight: 'bold' }}>Venda Rápida de Balcão</h1>
                            </div>

                            {/* Filtros de Categoria Dinâmicos do Banco */}
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                                <button
                                    onClick={() => setCategoriaAtiva('Todos')}
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: categoriaAtiva === 'Todos' ? '#710100' : '#ffffff',
                                        color: categoriaAtiva === 'Todos' ? '#ffffff' : '#6c757d',
                                        border: categoriaAtiva === 'Todos' ? '1px solid #710100' : '1px solid #ced4da',
                                        whiteSpace: 'nowrap', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: '500'
                                    }}
                                >
                                    Todos
                                </button>
                                {categorias.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategoriaAtiva(cat.id)}
                                        className="btn btn-sm"
                                        style={{
                                            backgroundColor: categoriaAtiva === cat.id ? '#710100' : '#ffffff',
                                            color: categoriaAtiva === cat.id ? '#ffffff' : '#6c757d',
                                            border: categoriaAtiva === cat.id ? '1px solid #710100' : '1px solid #ced4da',
                                            whiteSpace: 'nowrap', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: '500'
                                        }}
                                    >
                                        {cat.nome || cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {carregando ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#710100', fontWeight: 'bold' }}>Sincronizando cardápio...</div>
                        ) : (
                            /* GRID DE PRODUTOS CONFORME PADRÃO DA FOTO */
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', marginTop: '0px' }}>
                                {produtosFiltrados.map((produto) => (
                                    <div
                                        key={produto.id}
                                        className="stat-box"
                                        onClick={() => handleAdicionarAoCarrinho(produto)}
                                        style={{ cursor: 'pointer', overflow: 'hidden', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}
                                    >
                                        <img
                                            src={produto.imagemUrl ? `http://localhost:8081/uploads/${produto.imagemUrl}` : 'https://placehold.co/300x140/fbbfc5/600000?text=Petit+Rose'}
                                            alt={produto.nome}
                                            style={{ width: '100%', height: '130px', objectFit: 'cover' }}
                                        />

                                        <div style={{ padding: '12px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3 style={{ margin: '0', color: '#3c1010', fontSize: '0.95rem', fontWeight: 'bold' }}>{produto.nome}</h3>
                                                <p style={{ color: '#6c757d', fontSize: '0.75rem', margin: '2px 0 8px 0' }}>{produto.categoria?.nome || produto.categoria?.name || 'Geral'}</p>
                                            </div>
                                            <strong style={{ color: '#710100', fontSize: '1.05rem', fontFamily: 'Georgia' }}>
                                                {produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* COLUNA DIREITA: PAINEL DE FECHAMENTO (CARRINHO) */}
                    <div className="report-container" style={{ padding: '20px 15px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', height: 'fit-content', position: 'sticky', top: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #fff1f1', paddingBottom: '10px', marginBottom: '15px' }}>
                            <MdShoppingBasket style={{ fontSize: '1.3rem', color: '#710100' }} />
                            <h2 style={{ fontSize: '1.15rem', color: '#710100', margin: '0', fontFamily: 'Abhaya Libre, serif', fontWeight: 'bold' }}>Carrinho de Pedidos</h2>
                        </div>

                        {/* CONTAINER COM LISTAGEM COMPACTA */}
                        <div style={{ minHeight: '150px', maxHeight: '280px', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
                            {carrinho.length === 0 ? (
                                <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '35px', fontSize: '0.85rem', fontStyle: 'italic' }}>Nenhum produto selecionado.</p>
                            ) : (
                                carrinho.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#fffcfc', border: '1px solid #f8eeee', borderRadius: '8px' }}>
                                        <div style={{ maxWidth: '60%' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#3c1010', display: 'block' }}>{item.nome}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#710100', fontWeight: '500' }}>
                                                {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <button onClick={() => handleAlterarQuantidade(item.id, 'subtrair')} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', minWidth: '15px', textAlign: 'center' }}>{item.quantidade}</span>
                                            <button onClick={() => handleAlterarQuantidade(item.id, 'somar')} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* TOTALIZADOR E SUBMISSÃO */}
                        <div style={{ borderTop: '2px solid #fff1f1', paddingTop: '12px' }}>
                            <label style={{ fontWeight: '600', fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '5px' }}>FORMA DE PAGAMENTO:</label>
                            <select
                                value={metodoPagamento}
                                onChange={(e) => setMetodoPagamento(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '0.9rem', color: '#495057', cursor: 'pointer' }}
                            >
                                <option value="PIX">Pix</option>
                                <option value="DINHEIRO">Dinheiro</option>
                                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                            </select>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 'bold' }}>TOTAL DO PEDIDO:</span>
                                <span style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#710100', fontFamily: 'Georgia' }}>
                                    {totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>

                            <button
                                onClick={handleFinalizarVenda}
                                className="status-btn-pagamento"
                                style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                ⚡ Registrar Venda Rápida
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};