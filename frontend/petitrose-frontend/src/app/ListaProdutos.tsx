import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from './api';
import { Navbar } from './Navbar';
import { RowProduto } from './RowProduto';
import { CadastroProduto } from './CadastroProduto';
import { EditarProduto } from './EditarProduto';
import '../index.css';

interface Produto {
    id: string;
    nome: string;
    valor: number;
    descricao?: string;
}

export const ListaProdutos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);

    // Estados que controlam a visibilidade dos modais na tela
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [editarAberto, setEditarAberto] = useState(false);
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string | null>(null);

    const carregarProdutos = async () => {
        try {
            // Rota exata mapeada no seu ProdutoController do Spring Boot
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
                    carregarProdutos(); // Recarrega a tabela localmente após deletar
                } catch (error) {
                    Swal.fire('Erro', 'Erro ao tentar eliminar o produto.', 'error');
                }
            }
        });
    };

    // Função executada quando o usuário clica em "Editar" dentro do RowProduto
    const handleIniciarEdicao = (id: string) => {
        setProdutoSelecionadoId(id); // Guarda o ID do produto clicado
        setEditarAberto(true);       // Abre o modal de edição
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'block' }}>
                    <div className="produtos-table-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: 'var(--vinho-texto)' }}>Gerenciamento de Produtos</h2>
                            {/* O botão agora abre o modal em vez de navegar para outra rota */}
                            <button className="btn" onClick={() => setCadastroAberto(true)}>
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
                                    <RowProduto
                                        key={prod.id}
                                        produto={prod}
                                        onDeletar={handleDeletar}
                                        onEditar={handleIniciarEdicao} // Passa a função de abertura para a linha
                                    />
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Cadastro injetado na árvore do componente */}
            <CadastroProduto
                isOpen={cadastroAberto}
                onClose={() => setCadastroAberto(false)}
                onSucesso={carregarProdutos}
            />

            {/* Modal de Edição injetado na árvore do componente */}
            <EditarProduto
                isOpen={editarAberto}
                produtoId={produtoSelecionadoId}
                onClose={() => {
                    setEditarAberto(false);
                    setProdutoSelecionadoId(null); // Limpa o ID selecionado ao fechar
                }}
                onSucesso={carregarProdutos}
            />
        </div>
    );
};