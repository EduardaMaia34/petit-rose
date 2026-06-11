import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import Swal from 'sweetalert2';
import { api } from './api';
import { Navbar } from './Navbar';
import { CadastroProduto } from './CadastroProduto';
import { EditarProduto } from './EditarProduto';
=======
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from './api';
import { Navbar } from './Navbar';
import { RowProduto } from './RowProduto';
>>>>>>> origin/dev-gustavo
import '../index.css';

interface Produto {
    id: string;
    nome: string;
<<<<<<< HEAD
    valor: number;
    descricao?: string;
    imagemUrl?: string;
=======
    preco: number;
    descricao?: string;
>>>>>>> origin/dev-gustavo
}

export const ListaProdutos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
<<<<<<< HEAD
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [editarAberto, setEditarAberto] = useState(false);
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string | null>(null);
=======
    const navigate = useNavigate();
>>>>>>> origin/dev-gustavo

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

<<<<<<< HEAD
    const handleIniciarEdicao = (id: string) => {
        setProdutoSelecionadoId(id);
        setEditarAberto(true);
    };

    // Imagem alternativa caso o produto seja cadastrado sem imagem
    const imagemPlaceholder = "https://placehold.co/400x400/fbbfc5/600000?text=Petit+Rose";

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--vinho-texto)' }}>Gerenciamento de Produtos</h2>
                    </div>
                    <button className="btn-novo" onClick={() => setCadastroAberto(true)}>
                        + Novo Produto
                    </button>
                </div>

                {/* GRID DE CARDS ALINHADOS E VARIADOS */}
                {produtos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--vinho-texto)' }}>
                        Nenhum produto cadastrado no sistema Petit Rose.
                    </div>
                ) : (
                    <div className="pedidos-grid">
                        {produtos.map((prod) => (
                            <div key={prod.id} className="pedido-card" style={{ padding: '25px' }}>
                                {/* Renderização dinâmica da imagem servida pelo backend */}
                                <img
                                    src={prod.imagemUrl ? `http://localhost:8081/uploads/${prod.imagemUrl}` : imagemPlaceholder}
                                    alt={prod.nome}
                                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '15px', marginBottom: '15px' }}
                                />

                                <h3 style={{ fontFamily: 'Abhaya Libre', fontSize: '24px', color: 'var(--vinho-texto)', margin: '5px 0' }}>
                                    {prod.nome}
                                </h3>

                                <p style={{ fontSize: '14px', color: '#8b0000', fontStyle: 'italic', minHeight: '40px', margin: '5px 0 15px 0' }}>
                                    {prod.descricao || "Sem descrição cadastrada."}
                                </p>

                                <div style={{ fontFamily: 'Georgia', fontSize: '22px', fontWeight: 'bold', color: 'var(--vinho-texto)', marginBottom: '20px' }}>
                                    R$ {prod.valor.toFixed(2).replace('.', ',')}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                    <button
                                        className="status-btn-em-preparo"
                                        style={{ flex: 1, textAlign: 'center', backgroundColor: '#fbbfc5', color: '#600000' }}
                                        onClick={() => handleIniciarEdicao(prod.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="status-btn-pagamento"
                                        style={{ flex: 1, textAlign: 'center' }}
                                        onClick={() => handleDeletar(prod.id, prod.nome)}
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CadastroProduto
                isOpen={cadastroAberto}
                onClose={() => setCadastroAberto(false)}
                onSucesso={carregarProdutos}
            />

            <EditarProduto
                isOpen={editarAberto}
                produtoId={produtoSelecionadoId}
                onClose={() => {
                    setEditarAberto(false);
                    setProdutoSelecionadoId(null);
                }}
                onSucesso={carregarProdutos}
            />
=======
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
>>>>>>> origin/dev-gustavo
        </div>
    );
};