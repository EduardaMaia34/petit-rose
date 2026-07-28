import  { useEffect, useState } from 'react';
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
    categoria?: Categoria;
    categoriaId?: string;
    catalogoAtivo: boolean;
}

export const Catalogo = () => {
    const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [modoEdicao, setModoEdicao] = useState<boolean>(false);

    const buscarDados = async () => {
        try {
            setCarregando(true);
            const [responseProdutos, responseCategorias] = await Promise.all([
                api.get('/produtos'),
                api.get('/categorias')
            ]);
            setProdutos(responseProdutos.data);
            setCategorias(responseCategorias.data);
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os dados do catálogo.',
                icon: 'error',
                confirmButtonColor: '#600000'
            });
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarDados();
    }, []);

    const handleAlternarStatus = async (id: string, statusAtual: boolean) => {
        try {
            const produtoAlterado = produtos.find(p => p.id === id);
            if (!produtoAlterado) return;

            const idDaCategoria = produtoAlterado.categoriaId || produtoAlterado.categoria?.id;

            if (!idDaCategoria) {
                Swal.fire('Erro', 'Não foi possível mapear a categoria deste produto.', 'error');
                return;
            }

            await api.put(`/produtos/${id}`, {
                nome: produtoAlterado.nome,
                valor: produtoAlterado.valor,
                descricao: produtoAlterado.descricao,
                imagemUrl: produtoAlterado.imagemUrl,
                catalogoAtivo: !statusAtual,
                categoriaId: idDaCategoria
            });

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

    const produtosBase = modoEdicao
        ? produtos
        : produtos.filter(p => p.catalogoAtivo);

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="catalogo" />

            <div className="main-container">
                <div className="container-header">
                    <div>
                        <h2>Catálogo de Doces</h2>
                        <p>{modoEdicao ? 'Modo de Edição: Ative ou desative produtos no menu do cliente.' : 'Produtos disponíveis no momento.'}</p>
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
                    <div>
                        {produtosBase.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#8b0000', fontStyle: 'italic', padding: '40px' }}>
                                Nenhum produto encontrado para esta exibição.
                            </p>
                        ) : (
                            // Renderiza os blocos divididos por Categoria no Catálogo
                            categorias.map((cat) => {
                                const produtosDaCategoria = produtosBase.filter(
                                    p => p.categoria?.id === cat.id || p.categoriaId === cat.id
                                );

                                if (produtosDaCategoria.length === 0) return null;

                                return (
                                    <div key={cat.id} style={{ marginBottom: '50px' }}>
                                        <h3 style={{
                                            color: '#600000',
                                            borderBottom: '2px solid #fbbfc5',
                                            paddingBottom: '10px',
                                            marginBottom: '25px',
                                            textTransform: 'uppercase',
                                            fontFamily: 'Abhaya Libre, serif',
                                            fontSize: '24px',
                                            letterSpacing: '1px'
                                        }}>
                                            {cat.nome || cat.name}
                                        </h3>

                                        <div className="pedidos-grid">
                                            {produtosDaCategoria.map((produto) => (
                                                <div
                                                    key={produto.id}
                                                    className="pedido-card"
                                                    style={{
                                                        opacity: produto.catalogoAtivo ? 1 : 0.45,
                                                        transition: 'opacity 0.3s ease, transform 0.2s ease',
                                                        border: produto.catalogoAtivo ? '2px solid #fbbfc5' : '2px dashed #600000',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <div>
                                                        {/* ALTERAÇÃO: Nome do produto na parte superior */}
                                                        <h3 style={{
                                                            margin: '0 0 5px 0',
                                                            color: '#600000',
                                                            fontSize: '22px',
                                                            fontFamily: 'Abhaya Libre, serif',
                                                            lineHeight: '1.2'
                                                        }}>
                                                            {produto.nome}
                                                        </h3>

                                                        {/* ALTERAÇÃO: Preço logo abaixo do nome (Categoria removida) */}
                                                        <div style={{ marginBottom: '15px' }}>
                                                            <span style={{ fontWeight: 'bold', color: '#8b0000', fontSize: '16px' }}>
                                                                {produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </span>
                                                        </div>

                                                        <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '12px', marginBottom: '15px', backgroundColor: '#fff' }}>
                                                            <img
                                                                src={produto.imagemUrl ? `http://localhost:8081/uploads/${produto.imagemUrl}` : 'https://placehold.co/300x180?text=Petit+Rose'}
                                                                alt={produto.nome}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        </div>

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
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};