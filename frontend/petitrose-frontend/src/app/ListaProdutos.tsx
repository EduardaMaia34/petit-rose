import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from './api';
import { Navbar } from './Navbar';
import { CardProduto } from './CardProduto';
import { CadastroProduto } from './CadastroProduto';
import { EditarProduto } from './EditarProduto';
import '../index.css';
import { BiPlusCircle, BiFilterAlt } from 'react-icons/bi';

interface Categoria {
    id: string;
    nome: string;
}

interface Produto {
    id: string;
    nome: string;
    valor: number;
    descricao?: string;
    imagemUrl?: string;
    categoria?: Categoria;
}

export const ListaProdutos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODOS');
    const [carregando, setCarregando] = useState<boolean>(true);

    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [editarAberto, setEditarAberto] = useState(false);
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string | null>(null);

    const carregarDadosTela = async () => {
        try {
            setCarregando(true);
            const [responseProdutos, responseCategorias] = await Promise.all([
                api.get('/produtos'),
                api.get('/categorias')
            ]);
            setProdutos(responseProdutos.data);
            setCategorias(responseCategorias.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Não foi possível carregar os dados do cardápio.', 'error');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDadosTela();
    }, []);

    const handleDeletar = (id: string, nome: string) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Desejas eliminar definitivamente o produto: ${nome}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#600000',
            cancelButtonColor: '#fbbfc5',
            confirmButtonText: 'Sim, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/produtos/${id}`);
                    Swal.fire('Eliminado!', 'O produto foi removido com sucesso.', 'success');
                    carregarDadosTela();
                } catch (error) {
                    Swal.fire('Erro', 'Erro ao tentar eliminar o produto.', 'error');
                }
            }
        });
    };

    const handleIniciarEdicao = (id: string) => {
        setProdutoSelecionadoId(id);
        setEditarAberto(true);
    };

    const produtosFiltradosBase = categoriaFiltro === 'TODOS'
        ? produtos
        : produtos.filter(prod => prod.categoria?.id === categoriaFiltro);

    const categoriasVisiveis = categoriaFiltro === 'TODOS'
        ? categorias
        : categorias.filter(cat => cat.id === categoriaFiltro);

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="produtos" />

            <div className="main-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--vinho-texto)', fontSize: '28px', fontFamily: "'Georgia', serif" }}>
                            Gerenciamento de Produtos
                        </h2>

                        <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BiFilterAlt color="var(--vinho-texto)" />
                            <span style={{ color: 'var(--vinho-texto)', fontWeight: 'bold', fontSize: '15px' }}>Filtrar por:</span>
                            <select
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                                style={{
                                    padding: '8px 15px',
                                    borderRadius: 'var(--radius-p)',
                                    border: '1px solid var(--rosa-escuro)',
                                    color: 'var(--vinho-texto)',
                                    backgroundColor: '#fff',
                                    fontWeight: 'bold',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="TODOS">Todas as categorias</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        className="btn-novo"
                        onClick={() => setCadastroAberto(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
                    >
                        <BiPlusCircle size={20} /> Novo Produto
                    </button>
                </div>

                {carregando ? (
                    <p style={{ textAlign: 'center', color: 'var(--vinho-texto)', padding: '40px', fontWeight: 'bold' }}>
                        Carregando os doces da Petit Rose...
                    </p>
                ) : produtosFiltradosBase.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '40px', fontStyle: 'italic' }}>
                        Nenhum produto encontrado para esta seleção.
                    </p>
                ) : (
                    <div>
                        {categoriasVisiveis.map((categoria) => {
                            const produtosDaCategoria = produtosFiltradosBase.filter(
                                (prod) => prod.categoria?.id === categoria.id
                            );

                            if (produtosDaCategoria.length === 0) return null;

                            return (
                                <div key={categoria.id} style={{ marginBottom: '40px' }}>
                                    <h3 style={{
                                        color: 'var(--vinho-texto)',
                                        fontFamily: 'inherit',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.5px',
                                        borderBottom: '2px solid #fbbfc5',
                                        paddingBottom: '8px',
                                        marginBottom: '20px',
                                        fontSize: '20px'
                                    }}>
                                        {categoria.nome}
                                    </h3>
                                    <div className="pedidos-grid">
                                        {produtosDaCategoria.map((prod) => (
                                            <CardProduto
                                                key={prod.id}
                                                produto={prod}
                                                onEditarClick={handleIniciarEdicao}
                                                onDeletarClick={handleDeletar}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {categoriaFiltro === 'TODOS' && produtos.some(p => !p.categoria) && (
                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ color: 'var(--vinho-texto)', borderBottom: '2px solid #fbbfc5', paddingBottom: '8px', marginBottom: '20px', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '20px' }}>
                                    Sem Categoria Relacionada
                                </h3 >
                                <div className="pedidos-grid">
                                    {produtos.filter(p => !p.categoria).map((prod) => (
                                        <CardProduto
                                            key={prod.id}
                                            produto={prod}
                                            onEditarClick={handleIniciarEdicao}
                                            onDeletarClick={handleDeletar}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CadastroProduto isOpen={cadastroAberto} onClose={() => setCadastroAberto(false)} onSucesso={carregarDadosTela} />
            <EditarProduto
                isOpen={editarAberto}
                produtoId={produtoSelecionadoId}
                onClose={() => { setEditarAberto(false); setProdutoSelecionadoId(null); }}
                onSucesso={carregarDadosTela}
            />
        </div>
    );
};