// src/components/PedidoCard.tsx
import React from 'react';

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

interface PedidoCardProps {
    pedido: PedidoData;
    onAlterarStatus: (id: string, pedidoOriginal: any, statusTexto: string) => void;
    onDeletarPedido: (id: string) => void;
    onEditarClick: (pedido: PedidoData) => void; // 🔥 Nova propriedade para o clique de edição
}

export const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, onAlterarStatus, onDeletarPedido, onEditarClick }) => {
    return (
        <div className="pedido-card" style={{ fontFamily: "'Georgia', serif", padding: '15px' }}>
            <div>
                <div className="pedido-meta">
                    <p>Pedido #{pedido.id.substring(0, 5)}</p>
                    <p>{new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginBottom: '5px' }}>
                    <h3 style={{ margin: 0, color: '#600000', fontSize: '1.17em', fontWeight: 'bold' }}>
                        Mesa: {pedido.comanda?.numeroMesa || 'N/A'}
                    </h3>

                    {/* 🔥 AGORA CHAMA O MODAL EM VEZ DE NAVEGAR */}
                    {pedido.status !== 'CONCLUIDO' && (
                        <button
                            onClick={() => onEditarClick(pedido)}
                            title="Editar Pedido"
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '16px',
                                color: '#600000',
                                cursor: 'pointer',
                                padding: '2px 5px'
                            }}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontFamily: 'sans-serif',
                        backgroundColor: '#600000',
                        color: '#fff8e6'
                    }}>
                        {pedido.status}
                    </span>
                </div>

                <ul style={{ marginTop: '10px', listStyleType: 'none', paddingLeft: 0 }}>
                    {pedido.itens?.map((item) => (
                        <li key={item.id} style={{ padding: '4px 0', borderBottom: '1px dashed #f1d2d6' }}>
                            <strong>{item.quantidade}x</strong> {item.produto?.nome}
                        </li>
                    ))}
                </ul>

                <div className="pedido-total" style={{ color: '#600000', fontWeight: 'bold', marginTop: '15px' }}>
                    Total: R$ {Number(pedido.valorTotal).toFixed(2)}
                </div>
            </div>

            <div className="status-area" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                {pedido.status === 'PENDENTE' && <button className="status-btn-em-preparo" onClick={() => onAlterarStatus(pedido.id, pedido, 'PREPARANDO')} style={{ backgroundColor: '#fbbfc5', color: '#600000', flex: 1 }}>Preparar</button>}
                {pedido.status === 'PREPARANDO' && <button className="status-btn-em-preparo" onClick={() => onAlterarStatus(pedido.id, pedido, 'PRONTO')} style={{ backgroundColor: '#fbbfc5', color: '#600000', flex: 1 }}>Pronto</button>}
                {pedido.status === 'PRONTO' && <button className="status-btn-em-preparo" onClick={() => onAlterarStatus(pedido.id, pedido, 'CONCLUIDO')} style={{ backgroundColor: '#fbbfc5', color: '#600000', flex: 1 }}>Concluir</button>}

                {pedido.status !== 'CONCLUIDO' && pedido.status !== 'CANCELADO' && (
                    <button className="status-btn-cancelar" onClick={() => onDeletarPedido(pedido.id)} style={{ backgroundColor: '#600000', color: '#fff8e6', flex: 1, border: 'none', borderRadius: '8px', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Cancelar
                    </button>
                )}
            </div>
        </div>
    );
};