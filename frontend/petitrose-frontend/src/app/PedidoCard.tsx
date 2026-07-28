// src/components/PedidoCard.tsx
import React from 'react';
import { MdTableRestaurant, MdAccessTime, MdReceipt, MdPlayArrow, MdCheck, MdArchive, MdEdit, MdClose } from 'react-icons/md';

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
    onEditarClick: (pedido: PedidoData) => void;
}

export const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, onAlterarStatus, onDeletarPedido, onEditarClick }) => {

    // Função para definir o esquema de cores dinâmico baseado no status do pedido
    const obterCoresPorStatus = (status: string) => {
        switch (status) {
            case 'PENDENTE':
                return { bg: '#fff2e6', texto: '#b35c00', borda: '#ffe0cc' }; // Laranja suave
            case 'PREPARANDO':
                return { bg: '#e6f2ff', texto: '#0066cc', borda: '#cce6ff' }; // Azul suave
            case 'PRONTO':
                return { bg: '#e6f9ed', texto: '#1e7e34', borda: '#c3e6cb' }; // Verde clássico
            case 'CONCLUIDO':
                return { bg: '#f3e6ff', texto: '#6f42c1', borda: '#e4ccff' }; // Roxo discreto
            case 'CANCELADO':
                return { bg: '#fdf2f2', texto: '#dc3545', borda: '#f8d7da' }; // Vermelho suave
            default:
                return { bg: '#f8f9fa', texto: '#6c757d', borda: '#dee2e6' };
        }
    };

    const coresStatus = obterCoresPorStatus(pedido.status);

    // Formatação de data legível curta
    const formatarHora = (dataStr: string) => {
        try {
            const data = new Date(dataStr);
            return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '--:--';
        }
    };

    return (
        <div
            className="pedido-card"
            style={{
                fontFamily: "'Georgia', serif",
                padding: '20px',
                backgroundColor: '#ffffff', // 🔥 CORRIGIDO: Alterado de creme/amarelo para Branco Puro
                border: `1px solid ${coresStatus.borda}`,
                borderTop: `5px solid ${coresStatus.texto}`,
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(96, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease',
                minHeight: '280px',
                boxSizing: 'border-box'
            }}
        >
            <div>
                {/* CABEÇALHO DO CARD */}
                <div className="pedido-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>
                        #{pedido.id.substring(0, 5).toUpperCase()}
                    </span>

                    {/* Badge de Status Customizada */}
                    <span style={{
                        backgroundColor: coresStatus.bg,
                        color: coresStatus.texto,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: `1px solid ${coresStatus.borda}`,
                        textTransform: 'uppercase'
                    }}>
                        {pedido.status}
                    </span>
                </div>

                {/* INFO MESA E HORÁRIO */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', color: '#600000', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                        <MdTableRestaurant size={16} color="#fcb1b0" />
                        <span>Mesa: {pedido.comanda?.numeroMesa ? String(pedido.comanda.numeroMesa).padStart(2, '0') : 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6c757d' }}>
                        <MdAccessTime size={16} />
                        <span>{formatarHora(pedido.dataCriacao)}</span>
                    </div>
                </div>

                {/* DIVISOR DELICADO */}
                <div style={{ height: '1px', backgroundColor: '#fbbfc5', opacity: 0.5, marginBottom: '12px' }}></div>

                {/* LISTAGEM DE ITENS */}
                <div className="pedido-itens-list" style={{ maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
                    {pedido.itens?.map((item) => (
                        <div key={item.id} style={{ marginBottom: '8px', fontSize: '13px', color: '#4a0000' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontWeight: '500' }}>
                                    <strong style={{ color: '#600000', marginRight: '4px' }}>{item.quantidade}x</strong>
                                    {item.produto?.nome || 'Produto'}
                                </span>
                                <span style={{ color: '#888', fontSize: '12px' }}>
                                    R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            {item.observacao && (
                                <p style={{
                                    margin: '4px 0 0 0',
                                    fontSize: '11px',
                                    color: '#b35c00',
                                    fontStyle: 'italic',
                                    backgroundColor: '#fff9f3', // 🔥 CORRIGIDO: Fundo da observação limpo para um tom neutro suave
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                    border: '1px solid #ffe0cc'
                                }}>
                                    Obs: {item.observacao}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RODAPÉ DO CARD: TOTAL E AÇÕES */}
            <div>
                <div style={{ height: '1px', backgroundColor: '#fbbfc5', opacity: 0.5, marginTop: '12px', marginBottom: '12px' }}></div>

                <div className="pedido-total" style={{ color: '#600000', fontWeight: 'bold', fontSize: '17px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#8c7a7a', fontWeight: 'normal' }}>Valor Total:</span>
                    <span style={{ fontFamily: 'Georgia', color: '#600000' }}>
                        R$ {Number(pedido.valorTotal).toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {/* ÁREA DE BOTÕES DINÂMICOS COM ÍCONES REACT */}
                <div className="status-area" style={{ marginTop: '15px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {pedido.status === 'PENDENTE' && (
                        <button
                            className="status-btn-em-preparo"
                            onClick={() => onAlterarStatus(pedido.id, pedido, 'PREPARANDO')}
                            style={{ backgroundColor: '#fbbfc5', color: '#600000', border: 'none', padding: '0 12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', flex: 1, height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
                        >
                            <MdPlayArrow size={18} /> Preparar
                        </button>
                    )}
                    {pedido.status === 'PREPARANDO' && (
                        <button
                            className="status-btn-em-preparo"
                            onClick={() => onAlterarStatus(pedido.id, pedido, 'PRONTO')}
                            style={{ backgroundColor: '#c3e6cb', color: '#1e7e34', border: 'none', padding: '0 12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', flex: 1, height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
                        >
                            <MdCheck size={18} /> Pronto
                        </button>
                    )}
                    {pedido.status === 'PRONTO' && (
                        <button
                            className="status-btn-em-preparo"
                            onClick={() => onAlterarStatus(pedido.id, pedido, 'CONCLUIDO')}
                            style={{ backgroundColor: '#e4ccff', color: '#6f42c1', border: 'none', padding: '0 12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', flex: 1, height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
                        >
                            <MdArchive size={18} /> Concluir
                        </button>
                    )}

                    {/* Botão de Edição com ícone React (Sempre centralizado e quadrado) */}
                    {pedido.status !== 'CONCLUIDO' && pedido.status !== 'CANCELADO' && (
                        <button
                            onClick={() => onEditarClick(pedido)}
                            style={{ backgroundColor: '#fff', color: '#600000', border: '1px solid #fcb1b0', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                            title="Editar Itens"
                        >
                            <MdEdit size={18} />
                        </button>
                    )}

                    {/* Botão de Cancelamento com ícone React */}
                    {pedido.status !== 'CONCLUIDO' && pedido.status !== 'CANCELADO' && (
                        <button
                            className="status-btn-cancelar"
                            onClick={() => onDeletarPedido(pedido.id)}
                            style={{ backgroundColor: '#600000', color: '#fff8e6', border: 'none', padding: '0 14px', height: '40px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px' }}
                        >
                            <MdClose size={16} /> Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};