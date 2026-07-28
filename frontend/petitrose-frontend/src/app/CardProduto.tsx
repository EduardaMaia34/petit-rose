import React from 'react';
import { BiEdit, BiTrash } from 'react-icons/bi';

interface Produto {
    id: string;
    nome: string;
    valor: number;
    descricao?: string;
    imagemUrl?: string;
}

interface CardProdutoProps {
    produto: Produto;
    onEditarClick?: (id: string) => void;
    onDeletarClick?: (id: string, nome: string) => void;
}

export const CardProduto: React.FC<CardProdutoProps> = ({ produto, onEditarClick, onDeletarClick }) => {
    const imagemPlaceholder = "https://placehold.co/400x400/fbbfc5/600000?text=Petit+Rose";

    return (
        <div
            className="pedido-card"
            style={{
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(251, 191, 197, 0.2)',
                border: '1px solid #fbbfc5',
                borderRadius: '12px',
                boxShadow: '0 2px 4px #fbbfc5' // Sombra bem leve para destacar sobre o fundo da página
            }}
        >
            <img
                src={produto.imagemUrl ? `http://localhost:8081/uploads/${produto.imagemUrl}` : imagemPlaceholder}
                alt={produto.nome}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '15px', marginBottom: '15px' }}
            />

            <h3 style={{ fontFamily: 'Abhaya Libre', fontSize: '24px', color: 'var(--vinho-texto)', margin: '5px 0 0 0', fontWeight: 'bold' }}>
                {produto.nome}
            </h3>

            {produto.descricao && (
                <p style={{ color: '#6c757d', fontSize: '14px', margin: '8px 0', flexGrow: 1, lineHeight: '1.4' }}>
                    {produto.descricao}
                </p>
            )}

            <div style={{ margin: '15px 0', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '14px', color: 'var(--vinho-texto)', fontWeight: 'bold' }}>R$</span>
                <span style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--vinho-texto)', fontFamily: 'Georgia, serif' }}>
                    {produto.valor.toFixed(2).replace('.', ',')}
                </span>
            </div>

            {(onEditarClick || onDeletarClick) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: 'auto' }}>
                    {onEditarClick && (
                        <button
                            className="status-btn-em-preparo"
                            style={{ flex: 1, textAlign: 'center', backgroundColor: '#fbbfc5', color: '#600000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 'bold', height: '38px', cursor: 'pointer', border: 'none', borderRadius: '10px' }}
                            onClick={() => onEditarClick(produto.id)}
                        >
                            <BiEdit size={16} /> Editar
                        </button>
                    )}
                    {onDeletarClick && (
                        <button
                            className="status-btn-pagamento"
                            style={{ flex: 1, textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 'bold', height: '38px', cursor: 'pointer', border: 'none', borderRadius: '10px' }}
                            onClick={() => onDeletarClick(produto.id, produto.nome)}
                        >
                            <BiTrash size={16} /> Deletar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};