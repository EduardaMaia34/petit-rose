import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';

// 1. MOCK DATA (Cardápio do Petit Rose para o balcão)
const cardapioProdutos = [
    { id: 'p1', nome: 'Cupcake Red Velvet', preco: 12.00, categoria: 'Cupcakes', icone: '🧁' },
    { id: 'p2', nome: 'Bento Cake Chocolate', preco: 40.00, categoria: 'Bolos', icone: '🎂' },
    { id: 'p3', nome: 'Fatia Torta Holandesa', preco: 15.00, categoria: 'Tortas', icone: '🍰' },
    { id: 'p4', nome: 'Brownie Tradicional', preco: 8.00, categoria: 'Doces', icone: '🍫' },
    { id: 'p5', nome: 'Brigadeiro Gourmet (Un)', preco: 2.50, categoria: 'Doces', icone: '🟤' },
    { id: 'p6', nome: 'Café Espresso', preco: 5.00, categoria: 'Bebidas', icone: '☕' },
];

// Interface para tipar os itens do carrinho
interface ItemCarrinho {
    id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

export const AtendimentoBalcao = () => {
    const navigate = useNavigate();
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

    // Categorias únicas para os filtros no topo
    const categorias = ['Todos', 'Cupcakes', 'Bolos', 'Tortas', 'Doces', 'Bebidas'];

    // Adiciona o produto ao carrinho
    const handleAdicionarAoCarrinho = (produto: typeof cardapioProdutos[0]) => {
        setCarrinho(prevCarrinho => {
            const itemExiste = prevCarrinho.find(item => item.id === produto.id);
            if (itemExiste) {
                return prevCarrinho.map(item =>
                    item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
                );
            }
            return [...prevCarrinho, { id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 }];
        });
    };

    // Altera a quantidade de um item já no carrinho (+ ou -)
    const handleAlterarQuantidade = (id: string, operacao: 'somar' | 'subtrair') => {
        setCarrinho(prevCarrinho =>
            prevCarrinho.map(item => {
                if (item.id === id) {
                    const novaQtd = operacao === 'somar' ? item.quantidade + 1 : item.quantidade - 1;
                    return { ...item, quantidade: novaQtd };
                }
                return item;
            }).filter(item => item.quantidade > 0) // Remove do carrinho se a quantidade chegar a 0
        );
    };

    // Calcula o valor total do carrinho
    const totalPedido = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    // Finaliza a venda rápida
    const handleFinalizarVenda = () => {
        if (carrinho.length === 0) {
            Swal.fire({
                title: 'Carrinho Vazio!',
                text: 'Selecione pelo menos um produto antes de finalizar.',
                icon: 'warning',
                confirmButtonColor: '#710100'
            });
            return;
        }

        Swal.fire({
            title: 'Confirmar Venda de Balcão?',
            text: `Total a pagar: R$ ${totalPedido.toFixed(2)}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Confirmar Pagamento',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Venda Concluída! 🎉',
                    text: 'O pedido foi registrado e o caixa foi atualizado.',
                    icon: 'success',
                    confirmButtonColor: '#710100'
                });
                setCarrinho([]); // Limpa o carrinho
            }
        });
    };

    // Filtra os produtos exibidos na tela
    const produtosFiltrados = categoriaAtiva === 'Todos'
        ? cardapioProdutos
        : cardapioProdutos.filter(p => p.categoria === categoriaAtiva);

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                    {/* COLUNA ESQUERDA: VITRINE DE PRODUTOS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* HEADER DA VITRINE */}
                        <div className="report-container" style={{ padding: '15px' }}>
                            <h2 style={{ color: '#710100', marginBottom: '10px' }}>Venda Rápida de Balcão 🍰</h2>

                            {/* Filtros de Categoria */}
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                                {categorias.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoriaAtiva(cat)}
                                        className="btn btn-sm"
                                        style={{
                                            backgroundColor: categoriaAtiva === cat ? '#710100' : '#f5f5f5',
                                            color: categoriaAtiva === cat ? '#fff' : '#6c757d',
                                            border: '1px solid #ddd',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* GRID DE PRODUTOS */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                            {produtosFiltrados.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="stat-box"
                                    onClick={() => handleAdicionarAoCarrinho(prod)}
                                    style={{ padding: '15px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{prod.icone}</div>
                                    <strong style={{ display: 'block', fontSize: '0.95rem', minHeight: '38px', color: '#333' }}>{prod.nome}</strong>
                                    <span style={{ display: 'block', color: '#710100', fontWeight: 'bold', marginTop: '10px', fontSize: '1.1rem' }}>
                                        R$ {prod.preco.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* COLUNA DIREITA: PAINEL DO CARRINHO DE PEDIDO */}
                    <div className="report-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'fit-content', position: 'sticky', top: '20px' }}>
                        <div className="container-header" style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '10px', marginBottom: '15px' }}>
                            <h2 style={{ fontSize: '1.2rem', color: '#710100' }}>🛍️ Carrinho de Pedidos</h2>
                        </div>

                        {/* LISTA DE ITENS SELECIONADOS */}
                        <div style={{ flex: 1, minHeight: '200px', maxHeight: '350px', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {carrinho.length === 0 ? (
                                <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '5px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    Nenhum produto selecionado.
                                </p>
                            ) : (
                                carrinho.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#fdfdfd', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
                                        <div style={{ maxWidth: '60%' }}>
                                            <span style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block' }}>{item.nome}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                        </div>

                                        {/* Controles de Quantidade */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button
                                                onClick={() => handleAlterarQuantidade(item.id, 'subtrair')}
                                                style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                -
                                            </button>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', minWidth: '15px', textAlign: 'center' }}>{item.quantidade}</span>
                                            <button
                                                onClick={() => handleAlterarQuantidade(item.id, 'somar')}
                                                style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* SUB-TOTAL E BOTÃO FINALIZAR */}
                        <div style={{ borderTop: '2px solid #f5f5f5', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontWeight: 'bold', color: '#6c757d' }}>VALOR TOTAL:</span>
                                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#710100' }}>
                                    R$ {totalPedido.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleFinalizarVenda}
                                className="btn btn-sm"
                                style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#28a745' }}
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