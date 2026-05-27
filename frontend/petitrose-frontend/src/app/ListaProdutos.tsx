import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from './api';
import { Navbar } from './Navbar';
import { RowProduto } from './RowProduto';
import '../index.css';

interface Produto {
    id: string;
    nome: string;
    preco: number;
    descricao?: string;
}

export const ListaProdutos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const navigate = useNavigate();

    const carregarProdutos = async () => {
        try {
            const response = await api.get('/produtos');
            setProdutos(response.data);
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível carregar os produtos.', 'error');
        }
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    const handleDeletar = (id: string, nome: string) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Desejas eliminar definitivamente o produto: ${nome}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/produtos/${id}`);
                    Swal.fire('Eliminado!', 'O produto foi removido com sucesso.', 'success');
                    carregarProdutos();
                } catch (error) {
                    Swal.fire('Erro', 'Erro ao tentar eliminar o produto.', 'error');
                }
            }
        });
    };

    return (
        <div className="dashboard-page">
            {/* Componente Navbar Reutilizável */}
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'block' }}>
                    <div className="produtos-table-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: 'var(--vinho-texto)' }}>Gerenciamento de Produtos</h2>
                            <button className="btn" onClick={() => navigate('/produtos/novo')}>
                                + Novo Produto
                            </button>
                        </div>

                        <table className="produtos-table">
                            <thead>
                            <tr>
                                <th>Nome do Produto</th>
                                <th>Preço</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {produtos.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center' }}>Nenhum produto cadastrado no sistema.</td>
                                </tr>
                            ) : (
                                produtos.map((prod) => (
                                    /* Componente de Linha de Produto Reutilizável */
                                    <RowProduto
                                        key={prod.id}
                                        produto={prod}
                                        onDeletar={handleDeletar}
                                    />
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};