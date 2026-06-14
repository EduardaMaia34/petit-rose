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
        <div className="pedido-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
            <img
                src={produto.imagemUrl ? `http://localhost:8081/uploads/${produto.imagemUrl}` : imagemPlaceholder}
                alt={produto.nome}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '15px', marginBottom: '15px' }}
            />

            <h3 style={{ fontFamily: 'Abhaya Libre', fontSize: '24px', color: 'var(--vinho-texto)', margin: '5px 0' }}>
                {produto.nome}
            </h3>

            <p style={{ fontSize: '14px', color: '#8b0000', fontStyle: 'italic', minHeight: '40px', margin: '5px 0 15px 0', flexGrow: 1 }}>
                {produto.descricao || "Sem descrição cadastrada."}
            </p>

            <div style={{ fontFamily: 'Georgia', fontSize: '22px', fontWeight: 'bold', color: 'var(--vinho-texto)', marginBottom: '20px' }}>
                R$ {produto.valor.toFixed(2).replace('.', ',')}
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