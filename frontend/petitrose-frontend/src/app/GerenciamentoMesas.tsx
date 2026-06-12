import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from "./api";
import '../index.css';
import { MdTableRestaurant, MdFlashOn } from 'react-icons/md';

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
    id: string;
    numeroMesa: number;
    aberta: boolean;
    valorTotalComanda: number;
    carrinho: ItemCarrinhoMesa[];
}

export const GerenciamentoMesas = () => {
    const navigate = useNavigate();
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [loading, setLoading] = useState(false);
    const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
    const [isModalAberto, setIsModalAberto] = useState(false);

    const handleAbrirDetalheMesa = async (mesa: Mesa) => {
        if (!mesa.aberta) {
            const result = await Swal.fire({
                title: `Abrir Mesa ${String(mesa.numeroMesa).padStart(2, '0')}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Abrir',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d'
            });

            if (!result.isConfirmed) return;
            await abrirMesa(mesa.numeroMesa);
            return;
        }

        setMesaSelecionada(mesa);
        setIsModalAberto(true);
    };

    const carregarMesas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/comandas/ativas');
            const mesasBackend = response.data.map((comanda: any) => ({
                ...comanda,
                carrinho: []
            }));
            setMesas(mesasBackend);
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível carregar as mesas.' });
        } finally {
            setLoading(false);
        }
    };

    const abrirMesa = async (numeroMesa: number) => {
        try {
            await api.post('/api/comandas', { numeroMesa });
            await carregarMesas();
            Swal.fire({ icon: 'success', title: `Mesa ${String(numeroMesa).padStart(2, '0')} aberta!`, confirmButtonColor: '#710100' });
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Erro ao abrir mesa', confirmButtonColor: '#710100' });
        }
    };

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

                    const mesaAtualizada = { ...m, aberta: true, carrinho: novoCarrinho };
                    setMesaSelecionada(mesaAtualizada);
                    return mesaAtualizada;
                }
                return m;
            })
        );
    };

    const handleFecharContaMesa = async () => {
        if (!mesaSelecionada) return;

        const result = await Swal.fire({
            title: `Fechar Mesa ${String(mesaSelecionada.numeroMesa).padStart(2, '0')}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Fechar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#710100',
            cancelButtonColor: '#6c757d'
        });

        if (!result.isConfirmed) return;

        try {
            await api.put(`/api/comandas/${mesaSelecionada.id}/fechar`);
            await carregarMesas();
            setMesaSelecionada(null);
            setIsModalAberto(false);
            Swal.fire({ icon: 'success', title: 'Mesa liberada!', confirmButtonColor: '#710100' });
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Erro ao fechar mesa', confirmButtonColor: '#710100' });
        }
    };

    useEffect(() => {
        carregarMesas();
    }, []);

    const numerosFixos = [1, 2, 3, 4, 5,6,7,8,9];

    const mesasExibicao = numerosFixos.map(numero => {
        const mesaBackend = mesas.find(mesa => mesa.numeroMesa === numero);
        if (mesaBackend) return mesaBackend;

        return {
            id: `livre-${numero}`,
            numeroMesa: numero,
            aberta: false,
            valorTotalComanda: 0,
            carrinho: []
        };
    });

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* CABEÇALHO COM MARGENS E ESPAÇAMENTOS REDUZIDOS */}
                    <div className="dashboard-header" style={{ marginBottom: '1px', width: '100%' }}>
                        <h1 style={{ color: '#710100', fontSize: '1.9rem', fontWeight: 'bold', margin: '0' }}>Gerenciamento de Mesas</h1>
                        <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0' }}>Gerencie o consumo das mesas em tempo real ou direcione para a venda rápida de balcão.</p>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#710100', fontWeight: '500', fontSize: '0.9rem' }}>
                            Sincronizando com o salão...
                        </div>
                    )}

                    {/* GRID DE CARDS COM GAP AJUSTADO */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '15px', width: '100%' }}>

                        {/* ⚡ CARD ATENDIMENTO DE BALCÃO */}
                        <div
                            className="stat-box"
                            style={{
                                padding: '20px 15px',
                                textAlign: 'center',
                                border: '1px solid #ffcccc',
                                borderRadius: '12px',
                                background: '#fff1f1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '220px',
                                boxShadow: '0 2px 6px rgba(113,1,0,0.03)'
                            }}
                        >
                            {/* Ícone do Raio Centralizado Perfeitamente */}
                            <div style={{ width: '46px', height: '#46px', minHeight: '46px', minWidth: '46px', borderRadius: '50%', backgroundColor: '#ffe4e4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MdFlashOn style={{ fontSize: '1.5rem', color: '#ff4d4d' }} />
                            </div>

                            <div style={{ margin: '8px 0' }}>
                                <strong style={{ fontSize: '1.1rem', color: '#710100', display: 'block', fontWeight: 'bold' }}>Atendimento Balcão</strong>
                                <span style={{ fontSize: '0.75rem', color: '#8c7a7a', display: 'block', marginTop: '4px', lineHeight: '1.3' }}>
                                    Venda rápida<br />/ pronta entrega
                                </span>
                            </div>

                            <button
                                onClick={() => navigate('/atendimento-balcao')}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ffcccc', borderRadius: '8px', backgroundColor: '#ffffff', color: '#ff4d4d', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Abrir Balcão
                            </button>
                        </div>

                        {/* RENDERIZAÇÃO DAS MESAS ESTILIZADAS */}
                        {mesasExibicao.map((mesa) => (
                            <div
                                key={mesa.id}
                                className="stat-box"
                                style={{
                                    padding: '20px 15px',
                                    textAlign: 'center',
                                    border: '1px solid #f0e6e6',
                                    borderRadius: '12px',
                                    background: '#fefcfa',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justify: 'space-between',
                                    minHeight: '220px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                }}
                            >
                                {/* Círculo do Ícone - Ajustado para Centralização Absoluta */}
                                <div style={{
                                    width: '46px',
                                    height: '46px',
                                    minHeight: '46px',
                                    minWidth: '46px',
                                    borderRadius: '50%',
                                    backgroundColor: mesa.aberta ? '#fdf2f2' : '#e6f7ed',

                                    // CORREÇÃO AQUI: Forçando flex completo e resetando linha
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: 0,             // Remove espaços invisíveis de texto debaixo do ícone
                                    margin: '0 auto'           // Garante que o círculo fique centralizado no card
                                }}>
                                    <MdTableRestaurant style={{
                                        fontSize: '1.6rem',
                                        color: mesa.aberta ? '#710100' : '#28a745',
                                        display: 'block'       // Remove o comportamento inline que causa desvios
                                    }} />
                                </div>

                                <div style={{ margin: '8px 0', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <strong style={{ fontSize: '1.1rem', color: '#3c1010', display: 'block', fontWeight: 'bold' }}>
                                        Mesa {String(mesa.numeroMesa).padStart(2, '0')}
                                    </strong>

                                    <span style={{
                                        display: 'block',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        color: mesa.aberta ? '#710100' : '#28a745',
                                        marginTop: '2px'
                                    }}>
                                        {mesa.aberta ? 'Ocupada' : 'Livre'}
                                    </span>

                                    {mesa.aberta && (
                                        <span style={{ display: 'block', marginTop: '6px', fontWeight: 'bold', color: '#710100', fontSize: '0.95rem' }}>
                                            R$ {Number(mesa.valorTotalComanda || 0).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleAbrirDetalheMesa(mesa)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: mesa.aberta ? '1px solid #710100' : '1px solid #28a745',
                                        borderRadius: '8px',
                                        backgroundColor: mesa.aberta ? '#fffcfc' : '#f9fdfa',
                                        color: mesa.aberta ? '#710100' : '#28a745',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {mesa.aberta ? 'Ver Comanda' : 'Abrir Mesa'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* MODAL / POP-UP */}
                    {/* ----------------- MODAL INTERNO COM DESIGN DA LISTA DE PRODUTOS ----------------- */}
                    {isModalAberto && mesaSelecionada && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(113, 1, 0, 0.4)', // Tom do projeto com opacidade
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 999,
                            backdropFilter: 'blur(3px)'
                        }}>
                            <div className="report-container" style={{
                                backgroundColor: '#ffffff',
                                padding: '30px',
                                width: '520px',
                                borderRadius: '15px',
                                boxShadow: '0px 10px 30px rgba(113, 1, 0, 0.15)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                border: '1px solid #f0e6e6'
                            }}>

                                {/* Header do Modal */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <h2 style={{ color: 'var(--vinho-texto)', margin: 0, fontFamily: 'Abhaya Libre', fontSize: '26px' }}>
                                         Detalhe da Mesa {String(mesaSelecionada.numeroMesa).padStart(2, '0')}
                                    </h2>
                                    <button onClick={() => { setIsModalAberto(false); setMesaSelecionada(null); }} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
                                </div>

                                {/* Adicionar itens rápido */}
                                <div>
                                    <strong style={{ fontSize: '14px', color: '#6c757d', display: 'block', marginBottom: '10px' }}> Adicionar produto a comanda:</strong>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '130px', overflowY: 'auto', paddingRight: '4px' }}>
                                        {cardapioLocal.map(prod => (
                                            <button
                                                key={prod.id}
                                                onClick={() => handleAdicionarItemMesa(prod.id)}
                                                className="btn btn-sm"
                                                style={{ fontSize: '12px', backgroundColor: '#fffcfc', border: '1px solid #ffcccc', color: 'var(--vinho-texto)', textAlign: 'left', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                {prod.nome} <span style={{ float: 'right', fontWeight: 'bold' }}>R$ {prod.preco.toFixed(2)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Lista do Carrinho da Mesa */}
                                <div style={{ borderTop: '2px solid #fff1f1', paddingTop: '15px' }}>
                                    <strong style={{ fontSize: '14px', color: '#6c757d', display: 'block', marginBottom: '10px' }}> Consumo Atual da Comanda:</strong>
                                    <div style={{小maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                                        {mesaSelecionada.carrinho.length === 0 ? (
                                            <p style={{ fontSize: '14px', color: '#8c7a7a', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>Nenhum item consumido nesta mesa até o momento.</p>
                                        ) : (
                                            mesaSelecionada.carrinho.map(item => (
                                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#fffcfc', border: '1px solid #f8eeee', borderRadius: '8px' }}>
                                                    <span style={{ color: 'var(--vinho-texto)', fontWeight: '500' }}>{item.quantidade}x {item.nome}</span>
                                                    <strong style={{ color: 'var(--vinho-texto)' }}>R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Rodapé com Totalizadores e Ações */}
                                <div style={{ borderTop: '2px solid #fff1f1', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: 'bold' }}>TOTAL DA CONTA</span>
                                        <h3 style={{ fontSize: '26px', fontWeight: 'bold', color: '#710100', margin: '2px 0 0 0', fontFamily: 'Georgia' }}>
                                            R$ {Number(mesaSelecionada.valorTotalComanda || 0).toFixed(2).replace('.', ',')}
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => { setIsModalAberto(false); setMesaSelecionada(null); }} className="status-btn-em-preparo" style={{ backgroundColor: '#f5f5f5', color: '#6c757d', border: '1px solid #ced4da', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                                            Voltar
                                        </button>
                                        <button onClick={handleFecharContaMesa} className="status-btn-pagamento" style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                                             Fechar Comanda
                                        </button>
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