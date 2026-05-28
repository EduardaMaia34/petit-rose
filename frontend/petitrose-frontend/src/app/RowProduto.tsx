import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Produto {
    id: string;
    nome: string;
    valor: number; // Alterado de preco para valor
    descricao?: string;
}

interface RowProdutoProps {
    produto: Produto;
    onDeletar: (id: string, nome: string) => void;
}

export const RowProduto: React.FC<RowProdutoProps> = ({ produto, onDeletar }) => {
    const navigate = useNavigate();

    return (
        <tr>
            <td>{produto.nome}</td>
            {/* 🔥 Lendo produto.valor */}
            <td style={{ fontWeight: 'bold' }}>R$ {produto.valor.toFixed(2)}</td>
            <td>{produto.descricao || <span style={{ color: '#999', fontSize: '13px' }}>Sem descrição</span>}</td>
            <td>
                <div className="btn-acoes">
                    <button className="btn-editar" onClick={() => navigate(`/produtos/editar/${produto.id}`)}>
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