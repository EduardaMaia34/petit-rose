import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from "./api";
import '../index.css';
import {
    MdTableRestaurant,
    MdFlashOn,
    MdAdd,
    MdReceipt,
    MdRestaurantMenu,
    MdShoppingBasket,
    MdRemove
} from 'react-icons/md';

interface ProdutoBackend {
    id: string;
    nome: string;
    valor: number;
    catalogoAtivo: boolean;
}

interface ItemComanda {
    id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

interface ComandaAtiva {
    id: string;
    codigoIdentificador: string;
    valorTotalComanda: number;
    carrinho: ItemComanda[];
}

interface MesaSalao {
    numeroMesa: number;
    aberta: boolean;
    valorTotalMesa: number;
    comandas: ComandaAtiva[];
}

export const GerenciamentoMesas = () => {
    const navigate = useNavigate();
    const [mesas, setMesas] = useState<MesaSalao[]>([]);
    const [cardapio, setCardapio] = useState<ProdutoBackend[]>([]);
    const [loading, setLoading] = useState(false);

    const [mesaSelecionada, setMesaSelecionada] = useState<MesaSalao | null>(null);
    const [comandaAtivaId, setComandaAtivaId] = useState<string | null>(null);
    const [isModalAberto, setIsModalAberto] = useState(false);

    // 1. CARREGAMENTO E SINCRO DE ENTRADA DO BANCO
    const inicializarSalao = async () => {
        try {
            if (!isModalAberto) setLoading(true);

            const [responseComandas, responseProdutos] = await Promise.all([
                api.get('/comandas/ativas'),
                api.get('/produtos')
            ]);

            const todasComandas = responseComandas.data;
            setCardapio(responseProdutos.data.filter((p: any) => p.catalogoAtivo || p.catalogo_ativo));

            const salaoMapeado: MesaSalao[] = Array.from({ length: 9 }, (_, idx) => {
                const numero = idx + 1;
                const comandasDaMesa = todasComandas.filter((c: any) => c.numeroMesa === numero);

                return {
                    numeroMesa: numero,
                    aberta: comandasDaMesa.length > 0,
                    valorTotalMesa: comandasDaMesa.reduce((acc: number, c: any) => acc + (c.valorTotalComanda || c.total || 0), 0),
                    comandas: comandasDaMesa.map((c: any, cIdx: number) => {
                        let itensMapeados: ItemComanda[] = [];

                        if (c.pedidos && Array.isArray(c.pedidos)) {
                            c.pedidos.forEach((p: any) => {
                                if (p.itens && Array.isArray(p.itens)) {
                                    p.itens.forEach((item: any) => {
                                        itensMapeados.push({
                                            id: item.produto?.id || item.produtoId || item.id,
                                            nome: item.produto?.nome || item.nomeProduto || "Item",
                                            preco: item.precoUnitario || item.produto?.valor || 0,
                                            quantidade: item.quantidade || 1
                                        });
                                    });
                                }
                            });
                        } else if (c.itens && Array.isArray(c.itens)) {
                            itensMapeados = c.itens.map((item: any) => ({
                                id: item.produto?.id || item.produtoId || item.id,
                                nome: item.produto?.nome || item.nomeProduto || "Item",
                                preco: item.precoUnitario || item.produto?.valor || 0,
                                quantidade: item.quantidade || 1 // 💎 PROPRIEDADE CORRIGIDA E SINCRONIZADA
                            }));
                        }

                        return {
                            id: c.id,
                            codigoIdentificador: `Comanda ${cIdx + 1}`,
                            valorTotalComanda: c.valorTotalComanda || c.total || itensMapeados.reduce((acc, i) => acc + (i.preco * i.quantidade), 0),
                            carrinho: itensMapeados
                        };
                    })
                };
            });

            setMesas(salaoMapeado);

            if (mesaSelecionada) {
                const mesaAtualizada = salaoMapeado.find(m => m.numeroMesa === mesaSelecionada.numeroMesa);
                if (mesaAtualizada && mesaAtualizada.aberta) {
                    setMesaSelecionada(mesaAtualizada);
                } else {
                    setIsModalAberto(false);
                    setMesaSelecionada(null);
                    setComandaAtivaId(null);
                }
            }
        } catch (error) {
            console.error("Erro na sincronização:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        inicializarSalao();
    }, []);

    const handleAbrirMesaOuComanda = async (mesa: MesaSalao) => {
        if (!mesa.aberta) {
            const result = await Swal.fire({
                title: `Abrir Mesa ${String(mesa.numeroMesa).padStart(2, '0')}?`,
                text: "Uma nova comanda será aberta para esta mesa.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Abrir Mesa',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#28a745'
            });
            if (!result.isConfirmed) return;
            await criarNovaComandaNoBanco(mesa.numeroMesa);
        } else {
            setMesaSelecionada(mesa);
            setComandaAtivaId(mesa.comandas[0]?.id || null);
            setIsModalAberto(true);
        }
    };

    const criarNovaComandaNoBanco = async (numeroMesa: number) => {
        try {
            const res = await api.post('/comandas', { numeroMesa });
            const novaComandaId = res.data.id;
            await inicializarSalao();
            setComandaAtivaId(novaComandaId);
            setIsModalAberto(true);
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível abrir a comanda.', 'error');
        }
    };

    const handleAdicionarMaisUmaComanda = async () => {
        if (!mesaSelecionada) return;
        await criarNovaComandaNoBanco(mesaSelecionada.numeroMesa);
    };

    const handleAdicionarItemMesa = async (produtoId: string) => {
        if (!mesaSelecionada || !comandaAtivaId) return;

        const produto = cardapio.find(p => p.id === produtoId);
        if (!produto) return;

        setMesaSelecionada(prev => {
            if (!prev) return null;
            return {
                ...prev,
                comandas: prev.comandas.map(c => {
                    if (c.id !== comandaAtivaId) return c;
                    const existente = c.carrinho.find(item => item.id === produtoId);
                    const novoCarrinho = existente
                        ? c.carrinho.map(item => item.id === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item)
                        : [...c.carrinho, { id: produto.id, nome: produto.nome, preco: produto.valor, quantidade: 1 }];

                    return { ...c, carrinho: novoCarrinho, valorTotalComanda: novoCarrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0) };
                })
            };
        });

        try {
            await api.post(`/pedidos/comanda/${comandaAtivaId}`, {
                itens: [{
                    id: produtoId,         // ✨ Envia como id
                    produtoId: produtoId,  // ✨ Envia também como produtoId (Garante compatibilidade)
                    quantidade: 1,
                    observacao: "Salão"
                }]
            });
            await inicializarSalao();
        } catch (error) {
            console.error("Erro ao salvar item:", error);
        }
    };

    const handleAlterarQuantidadeItem = async (produtoId: string, operacao: 'somar' | 'subtrair') => {
        if (!mesaSelecionada || !comandaAtivaId) return;

        const comandaAlvo = mesaSelecionada.comandas.find(c => c.id === comandaAtivaId);
        const itemLocal = comandaAlvo?.carrinho.find(i => i.id === produtoId);
        if (!itemLocal) return;

        const novaQtd = operacao === 'somar' ? itemLocal.quantidade + 1 : itemLocal.quantidade - 1;

        setMesaSelecionada(prev => {
            if (!prev) return null;
            return {
                ...prev,
                comandas: prev.comandas.map(c => {
                    if (c.id !== comandaAtivaId) return c;
                    const novoCarrinho = c.carrinho.map(item => {
                        if (item.id !== produtoId) return item;
                        return { ...item, quantidade: novaQtd };
                    }).filter(item => item.quantidade > 0);

                    return { ...c, carrinho: novoCarrinho, valorTotalComanda: novoCarrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0) };
                })
            };
        });

        try {
            if (novaQtd === 0) {
                await api.delete(`/pedidos/${comandaAtivaId}/item/${produtoId}`);
            } else {
                await api.put(`/pedidos/comanda/${comandaAtivaId}`, {
                    itens: [{ produtoId, quantidade: novaQtd }]
                });
            }
            await inicializarSalao();
        } catch (error) {
            console.error("Erro ao alterar quantidade:", error);
        }
    };

    const handleFecharComandaUnica = async () => {
        if (!comandaAtivaId || !mesaSelecionada) return;

        const comandaAlvo = mesaSelecionada.comandas.find(c => c.id === comandaAtivaId)!;

        // 💎 CORREÇÃO CRÍTICA: Valida pelo valor acumulado devolvido pelo DTO Java, contornando o array vazio
        if (!comandaAlvo.valorTotalComanda || comandaAlvo.valorTotalComanda <= 0) {
            Swal.fire('Atenção', 'Esta comanda não possui nenhum consumo registrado.', 'warning');
            return;
        }

        const { value: formaPagamento } = await Swal.fire({
            title: `Fechar ${comandaAlvo.codigoIdentificador}`,
            html: `Total acumulado: <strong>R$ ${comandaAlvo.valorTotalComanda.toFixed(2).replace('.', ',')}</strong>`,
            input: 'select',
            inputOptions: { 'PIX': 'Pix', 'DINHEIRO': 'Dinheiro', 'CARTAO_CREDITO': 'Crédito', 'CARTAO_DEBITO': 'Débito' },
            inputPlaceholder: 'Forma de pagamento',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Pagamento',
            confirmButtonColor: '#710100'
        });

        if (!formaPagamento) return;

        try {
            setLoading(true);

            // Executa o PUT exato que bate com o @PutMapping("/{id}/fechar") do seu ComandaController.java
            await api.put(`/comandas/${comandaAtivaId}/fechar?metodoPagamento=${formaPagamento}`);

            // Limpa as telas locais se o banco processar sem erros
            setIsModalAberto(false);
            setMesaSelecionada(null);
            setComandaAtivaId(null);
            await inicializarSalao();

            Swal.fire({
                icon: 'success',
                title: 'Mesa Liberada!',
                text: 'A comanda foi finalizada e o fluxo de caixa atualizado.',
                confirmButtonColor: '#710100'
            });

        } catch (error) {
            console.error("Erro ao fechar comanda:", error);
            Swal.fire('Erro', 'Não foi possível fechar a comanda no servidor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="mesas"/>

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    <div className="dashboard-header" style={{ marginBottom: '1px', width: '100%' }}>
                        <h1 style={{ color: '#710100', fontSize: '1.9rem', fontWeight: 'bold', margin: '0' }}>Gerenciamento de Mesas</h1>
                        <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0' }}>Gerencie o consumo das mesas em tempo real ou direcione para a venda rápida de balcão.</p>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#710100', fontSize: '0.9rem' }}>Sincronizando com o salão...</div>
                    )}

                    {/* GRID SALÃO */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '15px', width: '100%' }}>
                        {/* CARD BALCÃO */}
                        <div className="stat-box" style={{ padding: '20px 15px', textAlign: 'center', border: '1px solid #ffcccc', borderRadius: '12px', background: '#fff1f1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: '220px' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#ffe4e4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MdFlashOn style={{ fontSize: '1.5rem', color: '#ff4d4d' }} />
                            </div>
                            <div style={{ margin: '8px 0' }}>
                                <strong style={{ fontSize: '1.1rem', color: '#710100', display: 'block' }}>Atendimento Balcão</strong>
                                <span style={{ fontSize: '0.75rem', color: '#8c7a7a' }}>Venda rápida / balcão</span>
                            </div>
                            <button onClick={() => navigate('/atendimento-balcao')} style={{ width: '100%', padding: '8px', border: '1px solid #ffcccc', borderRadius: '8px', backgroundColor: '#ffffff', color: '#ff4d4d', fontWeight: 'bold', cursor: 'pointer' }}>Abrir Balcão</button>
                        </div>

                        {/* MESAS */}
                        {mesas.map((mesa) => (
                            <div key={mesa.numeroMesa} className="stat-box" style={{ padding: '20px 15px', textAlign: 'center', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: '220px' }}>
                                <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: mesa.aberta ? '#fdf2f2' : '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                    <MdTableRestaurant style={{ fontSize: '1.6rem', color: mesa.aberta ? '#710100' : '#28a745' }} />
                                </div>
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <strong style={{ fontSize: '1.1rem', color: '#3c1010' }}>Mesa {String(mesa.numeroMesa).padStart(2, '0')}</strong>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: mesa.aberta ? '#710100' : '#28a745' }}>{mesa.aberta ? `${mesa.comandas.length} Comanda(s)` : 'Livre'}</span>
                                    {mesa.aberta && <span style={{ fontWeight: 'bold', color: '#710100', fontSize: '0.95rem', marginTop: '5px' }}>Mesa: R$ {mesa.valorTotalMesa.toFixed(2).replace('.', ',')}</span>}
                                </div>
                                <button
                                    onClick={() => handleAbrirMesaOuComanda(mesa)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: mesa.aberta ? '1px solid #710100' : '1px solid #28a745', backgroundColor: mesa.aberta ? '#fffcfc' : '#f9fdfa', color: mesa.aberta ? '#710100' : '#28a745' }}
                                >
                                    {mesa.aberta ? 'Ver Comandas' : 'Abrir Mesa'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* MODAL DETALHE DAS COMANDAS */}
                    {isModalAberto && mesaSelecionada && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(113, 1, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(3px)' }}>
                            <div className="report-container" style={{ backgroundColor: '#ffffff', padding: '25px', width: '560px', borderRadius: '15px', border: '1px solid #f0e6e6', display: 'flex', flexDirection: 'column', gap: '15px' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MdTableRestaurant style={{ fontSize: '1.2rem', color: '#710100' }} />
                                        </div>
                                        <h2 style={{ color: '#710100', margin: 0, fontFamily: 'Abhaya Libre', fontSize: '24px', fontWeight: 'bold' }}>Atendimento Mesa {String(mesaSelecionada.numeroMesa).padStart(2, '0')}</h2>
                                    </div>
                                    <button onClick={() => { setIsModalAberto(false); setMesaSelecionada(null); setComandaAtivaId(null); inicializarSalao(); }} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
                                </div>

                                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', borderBottom: '1px solid #eee' }}>
                                    {mesaSelecionada.comandas.map(c => (
                                        <button key={c.id} onClick={() => setComandaAtivaId(c.id)} style={{ padding: '8px 15px', border: '1px solid #ced4da', borderRadius: '8px 8px 0 0', cursor: 'pointer', backgroundColor: comandaAtivaId === c.id ? '#710100' : '#f8f9fa', color: comandaAtivaId === c.id ? '#fff' : '#495057', fontWeight: 'bold' }}>{c.codigoIdentificador}</button>
                                    ))}
                                    <button onClick={handleAdicionarMaisUmaComanda} style={{ padding: '8px 12px', border: '1px dashed #28a745', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#f4fbf7', color: '#28a745', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><MdAdd/> Nova Comanda</button>
                                </div>

                                {comandaAtivaId && mesaSelecionada.comandas.find(c => c.id === comandaAtivaId) && (() => {
                                    const comandaSelecionada = mesaSelecionada.comandas.find(c => c.id === comandaAtivaId)!;
                                    return (
                                        <>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><MdRestaurantMenu color="#6c757d"/><strong style={{ fontSize: '13px', color: '#6c757d' }}>Adicionar do cardápio real a esta comanda:</strong></div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '110px', overflowY: 'auto', paddingRight: '2px' }}>
                                                    {cardapio.map(prod => (
                                                        <button key={prod.id} onClick={() => handleAdicionarItemMesa(prod.id)} className="btn btn-sm" style={{ fontSize: '11px', backgroundColor: '#fffcfc', border: '1px solid #ffcccc', color: '#710100', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span>{prod.nome}</span> <strong>R$ {prod.valor.toFixed(2)}</strong>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid #fff1f1', paddingTop: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><MdShoppingBasket color="#6c757d"/><strong style={{ fontSize: '13px', color: '#6c757d' }}>Itens Consumidos:</strong></div>
                                                <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '2px' }}>
                                                    {comandaSelecionada.carrinho.length === 0 ? (
                                                        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c7a7a', margin: '15px 0', fontStyle: 'italic' }}>Comanda vazia. Adicione um doce acima!</p>
                                                    ) : (
                                                        comandaSelecionada.carrinho.map(item => (
                                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', backgroundColor: '#fffcfc', border: '1px solid #f8eeee', borderRadius: '10px' }}>
                                                                <span style={{ fontWeight: '500', color: '#3c1010', fontSize: '0.9rem' }}>{item.nome} (R$ {item.preco.toFixed(2)})</span>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <button onClick={() => handleAlterarQuantidadeItem(item.id, 'subtrair')} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}><MdRemove size={12}/></button>
                                                                    <strong style={{ minWidth: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantidade}</strong>
                                                                    <button onClick={() => handleAlterarQuantidadeItem(item.id, 'somar')} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}><MdAdd size={12}/></button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '2px solid #fff1f1', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: 'bold' }}>TOTAL DA {comandaSelecionada.codigoIdentificador.toUpperCase()}</span>
                                                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#710100', margin: 0, fontFamily: 'Georgia' }}>
                                                        R$ {comandaSelecionada.valorTotalComanda.toFixed(2).replace('.', ',')}
                                                    </h3>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => { setIsModalAberto(false); setMesaSelecionada(null); setComandaAtivaId(null); inicializarSalao(); }} className="status-btn-em-preparo" style={{ backgroundColor: '#f5f5f5', color: '#6c757d', border: '1px solid #ced4da', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Voltar</button>
                                                    <button onClick={handleFecharComandaUnica} className="status-btn-pagamento" style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}><MdReceipt/> Fechar Conta</button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};