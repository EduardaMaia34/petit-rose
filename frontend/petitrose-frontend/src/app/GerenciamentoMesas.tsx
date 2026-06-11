import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';

// 1. MOCK DATA: Cardápio para consumo local
const cardapioLocal = [
    { id: 'p1', nome: 'Fatia Torta Holandesa', preco: 15.00 },
    { id: 'p2', nome: 'Cupcake Red Velvet', preco: 12.00 },
    { id: 'p3', nome: 'Bento Cake Morango', preco: 45.00 },
    { id: 'p4', nome: 'Brigadeiro Gourmet', preco: 2.50 },
    { id: 'p5', nome: 'Café Espresso', preco: 5.00 },
    { id: 'p6', nome: 'Suco Natural de Laranja', preco: 7.00 },
];

interface ItemCarrinhoMesa {
    id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

interface Mesa {
    id: number;
    status: 'Livre' | 'Ocupada';
    carrinho: ItemCarrinhoMesa[];
}

export const GerenciamentoMesas = () => {
    const navigate = useNavigate();

    // Estado inicial com 5 mesas simuladas
    const [mesas, setMesas] = useState<Mesa[]>([
        { id: 1, status: 'Ocupada', carrinho: [{ id: 'p1', nome: 'Fatia Torta Holandesa', preco: 15.00, quantidade: 2 }, { id: 'p5', nome: 'Café Espresso', preco: 5.00, quantidade: 2 }] },
        { id: 2, status: 'Livre', carrinho: [] },
        { id: 3, status: 'Ocupada', carrinho: [{ id: 'p2', nome: 'Cupcake Red Velvet', preco: 12.00, quantidade: 1 }] },
        { id: 4, status: 'Livre', carrinho: [] },
        { id: 5, status: 'Livre', carrinho: [] },
    ]);

    // Estados para o Pop-up (Modal) de Detalhe da Mesa
    const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
    const [isModalAberto, setIsModalAberto] = useState(false);

    // Abre o Pop-up da mesa clicada
    const handleAbrirDetalheMesa = (mesa: Mesa) => {
        setMesaSelecionada(mesa);
        setIsModalAberto(true);
    };

    // Adiciona um item do cardápio à mesa de forma isolada
    const handleAdicionarItemMesa = (produtoId: string) => {
        if (!mesaSelecionada) return;

        const produto = cardapioLocal.find(p => p.id === produtoId);
        if (!produto) return;

        setMesas(prevMesas =>
            prevMesas.map(m => {
                if (m.id === mesaSelecionada.id) {
                    const itemExiste = m.carrinho.find(item => item.id === produtoId);
                    let novoCarrinho;

                    if (itemExiste) {
                        novoCarrinho = m.carrinho.map(item =>
                            item.id === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item
                        );
                    } else {
                        novoCarrinho = [...m.carrinho, { id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 }];
                    }

                    const mesaAtualizada = { ...m, status: 'Ocupada' as const, carrinho: novoCarrinho };
                    setMesaSelecionada(mesaAtualizada); // Sincroniza o modal aberto
                    return mesaAtualizada;
                }
                return m;
            })
        );
    };

    // Fecha a comanda da mesa e limpa o seu carrinho
    const handleFecharContaMesa = () => {
        if (!mesaSelecionada) return;

        const total = mesaSelecionada.carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

        Swal.fire({
            title: `Fechar Conta - Mesa ${mesaSelecionada.id}`,
            text: `Valor Total Consumido: R$ ${total.toFixed(2)}`,
            icon: 'summary',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Confirmar Pagamento e Liberar Mesa',
            cancelButtonText: 'Voltar'
        }).then((result) => {
            if (result.isConfirmed) {
                setMesas(prevMesas =>
                    prevMesas.map(m => m.id === mesaSelecionada.id ? { ...m, status: 'Livre', carrinho: [] } : m)
                );
                setIsModalAberto(false);
                setMesaSelecionada(null);
                Swal.fire({ title: 'Mesa Liberada! ✨', icon: 'success', confirmButtonColor: '#710100' });
            }
        });
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />

            <div className="main-container">
                <div className="content-wrapper">

                    {/* CABEÇALHO */}
                    <div className="dashboard-header" style={{ marginBottom: '25px' }}>
                        <h1 style={{ color: '#710100', fontSize: '1.8rem' }}>Salão & Atendimento Local 🪑</h1>
                        <p style={{ color: '#6c757d' }}>Gerencie o consumo das mesas em tempo real ou direcione para a venda rápida de balcão.</p>
                    </div>

                    {/* GRID PRINCIPAL DE MAPA DE COMPONENTES (Mesas + Balcão) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>

                        {/* ⚡ CARD ESPECIAL: ATENDIMENTO DE BALCÃO */}
                        <div
                            className="stat-box"
                            onClick={() => navigate('/atendimento-balcao')}
                            style={{ padding: '25px', textAlign: 'center', cursor: 'pointer', border: '2px dashed #710100', background: '#fffcfc' }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚡</div>
                            <strong style={{ fontSize: '1.2rem', color: '#710100', display: 'block' }}>Atendimento Balcão</strong>
                            <span style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginTop: '5px' }}>Venda Rápida / Pronta Entrega</span>
                        </div>

                        {/* RENDERIZAÇÃO DAS MESAS DO SALÃO */}
                        {mesas.map((mesa) => {
                            const totalMesa = mesa.carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
                            return (
                                <div
                                    key={mesa.id}
                                    className="stat-box"
                                    onClick={() => handleAbrirDetalheMesa(mesa)}
                                    style={{
                                        padding: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderLeft: mesa.status === 'Ocupada' ? '6px solid #fcc419' : '6px solid #28a745'
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🪑</div>
                                    <strong style={{ fontSize: '1.2rem', display: 'block' }}>Mesa {mesa.id}</strong>

                                    <span className={`status-badge ${mesa.status === 'Ocupada' ? 'status-preparo' : 'status-pago'}`} style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.75rem' }}>
                                        {mesa.status}
                                    </span>

                                    {mesa.status === 'Ocupada' && (
                                        <span style={{ display: 'block', marginTop: '10px', fontWeight: 'bold', color: '#710100' }}>
                                            Parcial: R$ {totalMesa.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                    </div>

                    {/* ----------------- POP-UP (MODAL): DETALHE DA MESA ----------------- */}
                    {isModalAberto && mesaSelecionada && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                            <div className="report-container" style={{ backgroundColor: '#fff', padding: '25px', width: '500px', borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '15px' }}>

                                {/* Header do Modal */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f5f5f5', paddingBottom: '10px' }}>
                                    <h2 style={{ color: '#710100' }}>🔎 Detalhe da Mesa {mesaSelecionada.id}</h2>
                                    <button onClick={() => setIsModalAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
                                </div>

                                {/* Adicionar itens rápido */}
                                <div>
                                    <strong style={{ fontSize: '0.9rem', color: '#6c757d' }}>➕ Adicionar Item à Comanda:</strong>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', maxHeight: '120px', overflowY: 'auto' }}>
                                        {cardapioLocal.map(prod => (
                                            <button
                                                key={prod.id}
                                                onClick={() => handleAdicionarItemMesa(prod.id)}
                                                className="btn btn-sm"
                                                style={{ fontSize: '0.75rem', backgroundColor: '#fdfdfd', border: '1px solid #ddd', color: '#333', textAlign: 'left' }}
                                            >
                                                {prod.nome} (R$ {prod.preco})
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Lista do Carrinho da Mesa */}
                                <div style={{ borderTop: '1px solid #f5f5f5', paddingTop: '10px' }}>
                                    <strong style={{ fontSize: '0.9rem', color: '#6c757d' }}>🛒 Itens Consumidos (Carrinho da Mesa):</strong>
                                    <div style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {mesaSelecionada.carrinho.length === 0 ? (
                                            <p style={{ fontSize: '0.85rem', color: '#6c757d', fontStyle: 'italic', textAlign: 'center' }}>Nenhum item consumido ainda.</p>
                                        ) : (
                                            mesaSelecionada.carrinho.map(item => (
                                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '6px 0', borderBottom: '1px solid #fafafa' }}>
                                                    <span>{item.quantidade}x {item.nome}</span>
                                                    <strong>R$ {(item.preco * item.quantidade).toFixed(2)}</strong>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Rodapé com Total e Botões de Fechamento */}
                                <div style={{ borderTop: '2px solid #f5f5f5', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>TOTAL DA CONTA:</span><br />
                                        <strong style={{ fontSize: '1.3rem', color: '#710100' }}>
                                            R$ {mesaSelecionada.carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2)}
                                        </strong>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setIsModalAberto(false)} className="btn btn-sm" style={{ backgroundColor: '#6c757d' }}>Voltar</button>
                                        {mesaSelecionada.carrinho.length > 0 && (
                                            <button onClick={handleFecharContaMesa} className="btn btn-sm" style={{ backgroundColor: '#28a745' }}>🧾 Fechar Conta</button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};