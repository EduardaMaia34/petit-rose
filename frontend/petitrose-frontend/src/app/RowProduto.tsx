import React from 'react';

interface Produto {
    id: string;
    nome: string;
    valor: number;
    descricao?: string;
}

interface RowProdutoProps {
    produto: Produto;
    onDeletar: (id: string, nome: string) => void;
    onEditar: (id: string) => void; // Nova propriedade adicionada para abrir o modal
}

export const RowProduto: React.FC<RowProdutoProps> = ({ produto, onDeletar, onEditar }) => {
    return (
        <tr>
            <td>{produto.nome}</td>
            <td style={{ fontWeight: 'bold' }}>R$ {produto.valor.toFixed(2)}</td>
            <td>{produto.descricao || <span style={{ color: '#999', fontSize: '13px' }}>Sem descrição</span>}</td>
            <td>
                <div className="btn-acoes">
                    {/* Dispara a função que abre o modal passando o ID do produto */}
                    <button className="btn-editar" onClick={() => onEditar(produto.id)}>
                        Editar
                    </button>
                    <button className="btn-deletar" onClick={() => onDeletar(produto.id, produto.nome)}>
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    );
};