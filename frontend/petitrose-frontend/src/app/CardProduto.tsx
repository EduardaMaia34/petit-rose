import React from 'react';

interface Produto {
    id: string;
    nome: string;
    valor: number;
    descricao?: string;
    imagemUrl?: string;
}

interface CardProdutoProps {
    produto: Produto;
    onEditar?: (id: string) => void;   // Opcional para poder reutilizar na tela do cliente
    onDeletar?: (id: string, nome: string) => void; // Opcional para poder reutilizar na tela do cliente
}

export const CardProduto: React.FC<CardProdutoProps> = ({ produto, onEditar, onDeletar }) => {
    // Imagem alternativa padrão caso o produto não possua foto
    const imagemPlaceholder = "https://placehold.co/400x400/fbbfc5/600000?text=Petit+Rose";

    return (
        <div className="pedido-card" style={{ padding: '25px' }}>
            {/* Renderização da imagem baseada na URL estática do seu WebConfig */}
            <img
                src={produto.imagemUrl ? `http://localhost:8081/uploads/${produto.imagemUrl}` : imagemPlaceholder}
                alt={produto.nome}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '15px', marginBottom: '15px' }}
            />

            <h3 style={{ fontFamily: 'Abhaya Libre', fontSize: '24px', color: 'var(--vinho-texto)', margin: '5px 0' }}>
                {produto.nome}
            </h3>

            <p style={{ fontSize: '14px', color: '#8b0000', fontStyle: 'italic', minHeight: '40px', margin: '5px 0 15px 0' }}>
                {produto.descricao || "Sem descrição cadastrada."}
            </p>

            <div style={{ fontFamily: 'Georgia', fontSize: '22px', fontWeight: 'bold', color: 'var(--vinho-texto)', marginBottom: '20px' }}>
                R$ {produto.valor.toFixed(2).replace('.', ',')}
            </div>

            {/* Renderiza a área de botões apenas se as funções de gerenciamento forem fornecidas */}
            {(onEditar || onDeletar) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    {onEditar && (
                        <button
                            className="status-btn-em-preparo"
                            style={{ flex: 1, textAlign: 'center', backgroundColor: '#fbbfc5', color: '#600000' }}
                            onClick={() => onEditar(produto.id)}
                        >
                            Editar
                        </button>
                    )}
                    {onDeletar && (
                        <button
                            className="status-btn-pagamento"
                            style={{ flex: 1, textAlign: 'center' }}
                            onClick={() => onDeletar(produto.id, produto.nome)}
                        >
                            Deletar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};