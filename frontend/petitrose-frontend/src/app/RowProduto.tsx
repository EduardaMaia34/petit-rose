import React from 'react';
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> origin/dev-gustavo

interface Produto {
    id: string;
    nome: string;
<<<<<<< HEAD
    valor: number;
=======
    valor: number; // Alterado de preco para valor
>>>>>>> origin/dev-gustavo
    descricao?: string;
}

interface RowProdutoProps {
    produto: Produto;
    onDeletar: (id: string, nome: string) => void;
<<<<<<< HEAD
    onEditar: (id: string) => void; // Nova propriedade adicionada para abrir o modal
}

export const RowProduto: React.FC<RowProdutoProps> = ({ produto, onDeletar, onEditar }) => {
    return (
        <tr>
            <td>{produto.nome}</td>
=======
}

export const RowProduto: React.FC<RowProdutoProps> = ({ produto, onDeletar }) => {
    const navigate = useNavigate();

    return (
        <tr>
            <td>{produto.nome}</td>
            {/* 🔥 Lendo produto.valor */}
>>>>>>> origin/dev-gustavo
            <td style={{ fontWeight: 'bold' }}>R$ {produto.valor.toFixed(2)}</td>
            <td>{produto.descricao || <span style={{ color: '#999', fontSize: '13px' }}>Sem descrição</span>}</td>
            <td>
                <div className="btn-acoes">
<<<<<<< HEAD
                    {/* Dispara a função que abre o modal passando o ID do produto */}
                    <button className="btn-editar" onClick={() => onEditar(produto.id)}>
=======
                    <button className="btn-editar" onClick={() => navigate(`/produtos/editar/${produto.id}`)}>
>>>>>>> origin/dev-gustavo
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