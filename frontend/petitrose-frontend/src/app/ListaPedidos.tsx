import React, { useEffect, useState } from 'react';
import { api } from './api';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../index.css';

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
    cliente: {
        id: string;
        nome: string;
    };
    comanda?: {
        id: string;
        numeroMesa: number;
    };
    itens: ItemPedidoData[];
}

export const ListaPedidos = () => {
    const [pedidos, setPedidos] = useState<PedidoData[]>([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    const carregarPedidos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/api/pedidos');

            // 🔥 Validação de segurança: só salva no estado se for de fato uma lista []
            if (Array.isArray(response.data)) {
                setPedidos(response.data);
            } else {
                console.error("O backend não retornou um Array válido:", response.data);
                setPedidos([]); // Evita que o .map quebre se vier um objeto
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

    const alterarStatus = async (id: string, pedidoAtualizado: any, statusTexto: string) => {
        try {
            await api.put(`/api/pedidos/${id}`, {
                ...pedidoAtualizado,
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
            title: 'Deletar Pedido?',
            text: "Esta ação excluirá o registro permanentemente do sistema.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#842020',
            confirmButtonText: 'Sim, deletar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/pedidos/${id}`);
                Swal.fire('Deletado!', 'Pedido removido com sucesso.', 'success');
                carregarPedidos();
            } catch (error) {
                Swal.fire('Erro', 'Não foi possível excluir o pedido.', 'error');
            }
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />
            <div className="main-container">
                <div className="container-header">
                    <div>
                        <h2>Pedidos</h2>
                        <p>Visualize e mude a fila de produção da Petit Rose.</p>
                    </div>
                    <button className="btn-novo" onClick={() => navigate('/pedidos/novo')}>
                        + Novo Pedido
                    </button>
                </div>

                {carregando ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>Carregando pedidos...</p>
                ) : (
                    <div className="pedidos-grid">
                        {pedidos.map(pedido => (
                            <div className="pedido-card" key={pedido.id}>
                                <div>
                                    <div className="pedido-meta">
                                        <p>Pedido #{pedido.id.substring(0, 5)}</p>
                                        <p>{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <h3>{pedido.cliente?.nome || 'Balcão / Sem Nome'}</h3>

                                    <p className="modalidade-loja" style={{ display: 'inline-block', margin: '5px 0' }}>
                                        Mesa: {pedido.comanda?.numeroMesa || 'N/A'}
                                    </p>

                                    <ul style={{ marginTop: '15px' }}>
                                        {pedido.itens?.map((item) => (
                                            <li key={item.id}>
                                                {item.quantidade}x {item.produto?.nome}
                                                {item.observacao && <small style={{ display: 'block', color: '#8b0000' }}>• Obs: {item.observacao}</small>}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pedido-total">
                                        Total: R$ {Number(pedido.valorTotal).toFixed(2)}
                                    </div>
                                </div>

                                <div className="status-area">
                                    <button className="status-btn-editar" onClick={() => navigate(`/pedidos/editar/${pedido.id}`)}>
                                        ✏️ Editar
                                    </button>

                                    {pedido.status === 'PENDENTE' && (
                                        <button className="status-btn-em-preparo" onClick={() => alterarStatus(pedido.id, pedido, 'PREPARANDO')}>
                                            Preparar
                                        </button>
                                    )}
                                    {pedido.status === 'PREPARANDO' && (
                                        <button className="status-btn-pagamento" onClick={() => alterarStatus(pedido.id, pedido, 'PRONTO')}>
                                            Pronto
                                        </button>
                                    )}

                                    <button className="status-btn-cancelar" onClick={() => deletarPedido(pedido.id)}>
                                        &times; Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pedidos.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Nenhum pedido em aberto.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};