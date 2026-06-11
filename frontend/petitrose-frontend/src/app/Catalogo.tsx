import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from './api';
import { Navbar } from './Navbar';
import '../index.css';

interface Categoria {
    id: string;
    nome?: string;
    name?: string;
}

interface ProdutoCatalogo {
    id: string;
    nome: string;
    valor: number;
    descricao: string;
    imagemUrl: string;
    nomeCategoria?: string;
    categoria?: Categoria; // Mapeamento do objeto categoria se vier do backend
    categoriaId?: string;  // Fallback caso venha como string direta
    catalogoAtivo: boolean;
}

export const Catalogo = () => {
    const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
    const [modoEdicao, setModoEdicao] = useState<boolean>(false);
    const [carregando, setCarregando] = useState<boolean>(true);

    const buscarProdutos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/produtos');
            setProdutos(response.data);
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os produtos do catálogo.',
                icon: 'error',
                confirmButtonColor: '#600000'
            });
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarProdutos();
    }, []);

    const handleAlternarStatus = async (id: string, statusAtual: boolean) => {
        try {
            const produtoAlterado = produtos.find(p => p.id === id);
            if (!produtoAlterado) return;

            // 🔥 CORREÇÃO CRÍTICA: Descobre o ID da categoria que veio do backend
            const idDaCategoria = produtoAlterado.categoriaId || produtoAlterado.categoria?.id;

            if (!idDaCategoria) {
                Swal.fire('Erro', 'Não foi possível mapear a categoria deste produto.', 'error');
                return;
            }

            // 🔥 O PUT agora envia o 'categoriaId' exigido pelo seu ProdutoDTO!
            await api.put(`/produtos/${id}`, {
                nome: produtoAlterado.nome,
                valor: produtoAlterado.valor,
                descricao: produtoAlterado.descricao,
                imagemUrl: produtoAlterado.imagemUrl,
                catalogoAtivo: !statusAtual, // Inverte o estado
                categoriaId: idDaCategoria  // Passa o UUID que o Spring valida com @NotNull
            });

            // Atualiza o estado local para mudar a opacidade na tela imediatamente
            setProdutos(prev =>
                prev.map(p => p.id === id ? { ...p, catalogoAtivo: !statusAtual } : p)
            );

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Status do produto atualizado!`,
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível alterar a visibilidade no catálogo.',
                icon: 'error',
                confirmButtonColor: '#600000'
            });
        }
    };

    const produtosFiltrados = modoEdicao
        ? produtos
        : produtos.filter(p => p.catalogoAtivo);

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div className="container-header">
                    <div>
                        <h2>Catálogo de Doces</h2>
                        <p>{modoEdicao ? 'Modo de Edição: Ative ou desative produtos no menu do cliente.' : 'Visão atual do cliente na Petit Rose.'}</p>
                    </div>

                    <button
                        className="btn-novo"
                        onClick={() => setModoEdicao(!modoEdicao)}
                        style={{ backgroundColor: modoEdicao ? '#710100' : '#600000' }}
                    >
                        {modoEdicao ? 'Salvar e Ver Catálogo' : 'Editar Catálogo'}
                    </button>
                </div>

                {carregando ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#600000', fontSize: '18px' }}>
                        Carregando delícias...
                    </div>
                ) : (
                    <div className="pedidos-grid">
                        {produtosFiltrados.length === 0 ? (
                            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#8b0000', fontStyle: 'italic' }}>
                                Nenhum produto encontrado para esta exibição.
                            </p>
                        ) : (
                            produtosFiltrados.map((produto) => (
                                <div
                                    key={produto.id}
                                    className="pedido-card"
                                    style={{
                                        opacity: produto.catalogoAtivo ? 1 : 0.45,
                                        transition: 'opacity 0.3s ease, transform 0.2s ease',
                                        border: produto.catalogoAtivo ? '2px solid #fbbfc5' : '2px dashed #600000'
                                    }}
                                >
                                    <div>
                                        <div className="pedido-meta">
                                            <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                {produto.nomeCategoria || produto.categoria?.nome || 'Doce'}
                                            </p>
                                            <p style={{ fontWeight: 'bold', color: '#600000' }}>
                                                {produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>

                                        <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '12px', marginBottom: '15px', backgroundColor: '#fff' }}>
                                            <img
                                                src={produto.imagemUrl ? `http://localhost:8081/uploads/${produto.imagemUrl}` : 'https://placehold.co/300x180?text=Petit+Rose'}
                                                alt={produto.nome}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>

                                        <h3 style={{ margin: '0 0 10px 0', color: '#600000', fontSize: '20px', fontFamily: 'Abhaya Libre, serif' }}>
                                            {produto.nome}
                                        </h3>

                                        <p className="observacoes" style={{ minHeight: '40px', marginBottom: '15px' }}>
                                            {produto.descricao}
                                        </p>
                                    </div>

                                    {modoEdicao && (
                                        <div className="status-area" style={{ borderTop: '1px dashed #ffd7c9', paddingTop: '15px', marginTop: '10px' }}>
                                            <button
                                                type="button"
                                                className={produto.catalogoAtivo ? 'status-btn-em-preparo' : 'status-btn-pagamento'}
                                                onClick={() => handleAlternarStatus(produto.id, produto.catalogoAtivo)}
                                                style={{ width: '100%', textAlign: 'center' }}
                                            >
                                                {produto.catalogoAtivo ? ' Remover do Catálogo' : ' Ativar no Catálogo'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};