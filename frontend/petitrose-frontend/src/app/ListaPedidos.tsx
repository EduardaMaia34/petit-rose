import  { useEffect, useState } from 'react';
import { api } from './api';
import { Navbar } from './Navbar';
import { PedidoCard } from './PedidoCard';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import {EditarPedido} from "./EditarPedido.tsx";

interface ItemPedidoData {
    id: string;
    quantidade: number;
    precoUnitario: number;
    observacao?: string;
    produto: {
        id: string;
        nome: string;
    };
}

interface PedidoData {
    id: string;
    dataCriacao: string;
    status: 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'CONCLUIDO' | 'CANCELADO';
    valorTotal: number;
    comanda?: {
        id: string;
        numeroMesa: number;
    };
    itens: ItemPedidoData[];
}

export const ListaPedidos = () => {
    const [pedidos, setPedidos] = useState<PedidoData[]>([]);
    const [carregando, setCarregando] = useState(true);

    // 🔥 ESTADOS PARA FILTRAGEM E MODAL
    const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
    const [pedidoSelecionadoParaEditar, setPedidoSelecionadoParaEditar] = useState<any | null>(null);
    const [isModalEdicaoAberto, setIsModalEdicaoAberto] = useState(false);

    const navigate = useNavigate();

    const carregarPedidos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/api/pedidos');

            if (Array.isArray(response.data)) {
                setPedidos(response.data);
            } else {
                console.error("O backend não retornou um Array válido:", response.data);
                setPedidos([]);
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos", error);
            setPedidos([]);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarPedidos();
    }, []);

    const abrirModalEdicao = (pedido: any) => {
        setPedidoSelecionadoParaEditar(pedido);
        setIsModalEdicaoAberto(true);
    };

    const fecharModalEdicao = () => {
        setPedidoSelecionadoParaEditar(null);
        setIsModalEdicaoAberto(false);
        carregarPedidos();
    };

    const alterarStatus = async (id: string, pedidoOriginal: any, statusTexto: string) => {
        try {
            await api.put(`/api/pedidos/${id}`, {
                id: id,
                valorTotal: pedidoOriginal.valorTotal,
                comanda: pedidoOriginal.comanda,
                itens: pedidoOriginal.itens,
                status: statusTexto
            });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Pedido movido para: ${statusTexto}`,
                showConfirmButton: false,
                timer: 2000
            });
            carregarPedidos();
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível atualizar o status.', 'error');
        }
    };

    const deletarPedido = async (id: string) => {
        const result = await Swal.fire({
            title: 'Cancelar Pedido?',
            text: "Esta ação mudará o status do pedido para CANCELADO permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#600000',
            cancelButtonColor: '#fbbfc5',
            confirmButtonText: 'Sim, cancelar',
            cancelButtonText: 'Manter pedido'
        });

        if (result.isConfirmed) {
            try {
                const pedidoAlvo = pedidos.find(p => p.id === id);
                if (pedidoAlvo) {
                    await api.put(`/api/pedidos/${id}`, {
                        ...pedidoAlvo,
                        status: 'CANCELADO'
                    });
                    Swal.fire('Cancelado!', 'O pedido foi cancelado na comanda.', 'success');
                    carregarPedidos();
                }
            } catch (error) {
                Swal.fire('Erro', 'Não foi possível cancelar o pedido.', 'error');
            }
        }
    };

    // 🔥 LÓGICA DE FILTRAGEM E ORDENAÇÃO COMBINADAS
    const obterPedidosProcessados = () => {
        // 1. Primeiro filtra de acordo com a caixa de seleção selecionada
        let listaFiltrada = pedidos;
        if (filtroStatus !== 'TODOS') {
            listaFiltrada = pedidos.filter(p => p.status === filtroStatus);
        }

        // 2. Depois ordena colocando os pedidos CONCLUIDO no final da fila
        return [...listaFiltrada].sort((a, b) => {
            if (a.status === 'CONCLUIDO' && b.status !== 'CONCLUIDO') return 1;
            if (a.status !== 'CONCLUIDO' && b.status === 'CONCLUIDO') return -1;
            return 0; // Mantém a ordem original para os outros status
        });
    };

    const pedidosProcessados = obterPedidosProcessados();

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />
            <div className="main-container">
                <div className="container-header">
                    <div>
                        <h2>Pedidos</h2>
                        <p>Visualize e mude a fila de produção da Petit Rose.</p>
                    </div>

                    {/* 🔥 CAIXA DE SELEÇÃO PARA FILTRAR POR STATUS */}
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '12px', marginBottom: '4px', color: '#600000', fontWeight: 'bold', fontFamily: 'sans-serif' }}>Filtrar Status:</label>
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    border: '2px solid #fbbfc5',
                                    backgroundColor: '#fffaf0',
                                    color: '#600000',
                                    fontFamily: 'sans-serif',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="TODOS">Ver Todos os Pedidos</option>
                                <option value="PENDENTE">Pendentes</option>
                                <option value="PREPARANDO">Em Preparo</option>
                                <option value="PRONTO">Prontos</option>
                                <option value="CONCLUIDO">Concluídos</option>
                                <option value="CANCELADO">Cancelados</option>
                            </select>
                        </div>

                        <button className="btn-novo" onClick={() => navigate('/pedidos/novo')} style={{ marginTop: '16px' }}>
                            + Novo Pedido
                        </button>
                    </div>
                </div>

                {carregando ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#600000' }}>Carregando pedidos...</p>
                ) : (
                    <div className="pedidos-grid">
                        {/* Renderiza a lista processada (filtrada e com concluídos por último) */}
                        {pedidosProcessados.map(pedido => (
                            <PedidoCard
                                key={pedido.id}
                                pedido={pedido}
                                onAlterarStatus={alterarStatus}
                                onDeletarPedido={deletarPedido}
                                onEditarClick={abrirModalEdicao}
                            />
                        ))}
                        {pedidosProcessados.length === 0 && (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#600000', fontStyle: 'italic', padding: '20px' }}>
                                Nenhum pedido encontrado para o filtro selecionado.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Edição (Se aberto) */}
            {isModalEdicaoAberto && pedidoSelecionadoParaEditar && (
                <div className="modal-backdrop" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 9999
                }}>
                    <div className="modal-content-wrapper" style={{
                        backgroundColor: '#fff8e6', padding: '25px', borderRadius: '8px',
                        maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                        position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        border: '2px solid #fbbfc5'
                    }}>
                        <button
                            onClick={fecharModalEdicao}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#600000' }}
                        >
                            &times;
                        </button>

                        <EditarPedido
                            idPedidoModal={pedidoSelecionadoParaEditar.id}
                            onClose={fecharModalEdicao}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};