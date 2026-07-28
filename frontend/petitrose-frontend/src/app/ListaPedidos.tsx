import { useEffect, useState } from 'react';
import { api } from './api';
import { Navbar } from './Navbar';
import { PedidoCard } from './PedidoCard';
import { EditarPedido } from './EditarPedido';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../index.css';

interface ItemPedidoData {
    id: string;
    quantidade: number;
    precoUnitario: number;
    observacao?: string;
    produto: { id: string; nome: string; };
}

interface PedidoData {
    id: string;
    dataCriacao: string;
    status: 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'CONCLUIDO' | 'CANCELADO';
    valorTotal: number;
    comanda?: { id: string; numeroMesa: number; };
    itens: ItemPedidoData[];
}

export const ListaPedidos = () => {
    const [pedidos, setPedidos] = useState<PedidoData[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
    const [pedidoSelecionadoParaEditar, setPedidoSelecionadoParaEditar] = useState<any | null>(null);
    const [isModalEdicaoAberto, setIsModalEdicaoAberto] = useState(false);

    const navigate = useNavigate();

    const carregarPedidos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/pedidos');

            if (Array.isArray(response.data)) {
                setPedidos(response.data);
            } else {
                setPedidos([]);
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos", error);
            setPedidos([]);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarPedidos(); }, []);

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
            await api.put(`/pedidos/${id}`, {
                ...pedidoOriginal,
                status: statusTexto
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
            confirmButtonText: 'Sim, cancelar'
        });

        if (result.isConfirmed) {
            try {
                const pedidoAlvo = pedidos.find(p => p.id === id);
                if (pedidoAlvo) {
                    await api.put(`/pedidos/${id}`, {
                        ...pedidoAlvo,
                        status: 'CANCELADO'
                    });
                    Swal.fire('Cancelado!', 'O pedido foi cancelado.', 'success');
                    carregarPedidos();
                }
            } catch (error) {
                Swal.fire('Erro', 'Não foi possível cancelar o pedido.', 'error');
            }
        }
    };

    // 🔥 FILTRO E ORDENAÇÃO ATUALIZADOS: Pedidos não finalizados (Pendente, Preparando, Pronto) ficam no topo!
    const pedidosProcessados = pedidos
        .filter(p => filtroStatus === 'TODOS' || p.status === filtroStatus)
        .sort((a, b) => {
            const ativos = ['PENDENTE', 'PREPARANDO', 'PRONTO'];
            const aAtivo = ativos.includes(a.status);
            const bAtivo = ativos.includes(b.status);

            if (aAtivo && !bAtivo) return -1;  // 'a' vai para cima
            if (!aAtivo && bAtivo) return 1;   // 'b' vai para cima
            return 0;                          // Mantém a ordem padrão cronológica se forem do mesmo grupo
        });

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />
            <div className="main-container">
                <div className="container-header">
                    <div>
                        <h2>Pedidos</h2>
                        <p>Visualize e mude a fila de produção da Petit Rose.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '12px', marginBottom: '4px', color: '#600000', fontWeight: 'bold' }}>Filtrar Status:</label>
                            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ padding: '8px 16px', borderRadius: '10px', border: '2px solid #fbbfc5', backgroundColor: '#fffaf0', color: '#600000', fontWeight: 'bold', cursor: 'pointer' }}>
                                <option value="TODOS">Ver Todos os Pedidos</option>
                                <option value="PENDENTE">Pendentes</option>
                                <option value="PREPARANDO">Em Preparo</option>
                                <option value="PRONTO">Prontos</option>
                                <option value="CONCLUIDO">Concluídos</option>
                                <option value="CANCELADO">Cancelados</option>
                            </select>
                        </div>
                    </div>
                </div>

                {carregando ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#600000' }}>Carregando pedidos...</p>
                ) : (
                    <div className="pedidos-grid">
                        {pedidosProcessados.map(pedido => (
                            <PedidoCard key={pedido.id} pedido={pedido} onAlterarStatus={alterarStatus} onDeletarPedido={deletarPedido} onEditarClick={abrirModalEdicao} />
                        ))}
                    </div>
                )}
            </div>

            {isModalEdicaoAberto && pedidoSelecionadoParaEditar && (
                <EditarPedido
                    idPedidoModal={pedidoSelecionadoParaEditar.id}
                    onClose={fecharModalEdicao}
                    onSucesso={fecharModalEdicao}
                />
            )}
        </div>
    );
};