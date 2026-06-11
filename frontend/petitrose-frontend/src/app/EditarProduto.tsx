import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
=======
import { useNavigate, useParams } from 'react-router-dom';
>>>>>>> origin/dev-gustavo
import Swal from 'sweetalert2';
import { api } from './api';
import '../index.css';

<<<<<<< HEAD
interface Categoria {
    id: string;
    nome: string;
}

interface EditarProdutoProps {
    isOpen: boolean;
    produtoId: string | null;
    onClose: () => void;
    onSucesso: () => void;
}

export const EditarProduto: React.FC<EditarProdutoProps> = ({ isOpen, produtoId, onClose, onSucesso }) => {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregandoImagem, setCarregandoImagem] = useState(false);

    useEffect(() => {
        const carregarDadosEDependencias = async () => {
            try {
                const responseCategorias = await api.get('/categorias');
                setCategorias(responseCategorias.data);

                const responseProduto = await api.get(`/produtos/${produtoId}`);
                setNome(responseProduto.data.nome);

                if (responseProduto.data.valor !== undefined && responseProduto.data.valor !== null) {
                    setValor(responseProduto.data.valor.toString());
=======
export const EditarProduto = () => {
    // Captura o ID da URL do React Router
    const { id } = useParams<{ id: string }>();
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState(''); // CORREÇÃO: alterado de preco para valor
    const [descricao, setDescricao] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const carregarProduto = async () => {
            try {
                // Faz a requisição para o Spring Boot na porta 8081
                const response = await api.get(`/produtos/${id}`);

                // Mapeia os dados vindo do backend
                setNome(response.data.nome);

                // 🔥 CORREÇÃO CRÍTICA: Lendo 'valor' em vez de 'preco'
                if (response.data.valor !== undefined && response.data.valor !== null) {
                    setValor(response.data.valor.toString());
>>>>>>> origin/dev-gustavo
                } else {
                    setValor('0.00');
                }

<<<<<<< HEAD
                setDescricao(responseProduto.data.descricao || '');
                setImagemUrl(responseProduto.data.imagemUrl || '');

                if (responseProduto.data.categoria) {
                    setCategoriaId(responseProduto.data.categoria.id);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do produto:", error);
                Swal.fire('Erro', 'Não foi possível obter as informações do produto.', 'error');
                onClose();
            }
        };

        if (isOpen && produtoId) {
            carregarDadosEDependencias();
        }
    }, [isOpen, produtoId, onClose]);

    if (!isOpen || !produtoId) return null;

    const handleUploadImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const arquivo = e.target.files[0];
        const formData = new FormData();
        formData.append('imagem', arquivo);

        try {
            setCarregandoImagem(true);
            const response = await api.post('/produtos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImagemUrl(response.data.nomeArquivo);
            Swal.fire('Sucesso', 'Nova imagem enviada com sucesso!', 'success');
        } catch (error) {
            Swal.fire('Erro', 'Falha ao processar o upload da imagem.', 'error');
        } finally {
            setCarregandoImagem(false);
        }
    };
=======
                setDescricao(response.data.descricao || '');
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
                Swal.fire('Erro', 'Produto não encontrado no sistema Petit Rose.', 'error');
                navigate('/produtos');
            }
        };

        if (id) {
            carregarProduto();
        }
    }, [id, navigate]);
>>>>>>> origin/dev-gustavo

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

<<<<<<< HEAD
        if (!nome || !valor || !categoriaId) {
=======
        if (!nome || !valor) {
>>>>>>> origin/dev-gustavo
            Swal.fire('Aviso', 'Preencha os campos obrigatórios (*)', 'warning');
            return;
        }

        try {
<<<<<<< HEAD
            await api.put(`/produtos/${produtoId}`, {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao.trim() === '' ? 'Sem descrição fornecida.' : descricao,
                categoriaId: categoriaId,
                imagemUrl: imagemUrl
            });

            Swal.fire('Sucesso!', 'Produto atualizado com sucesso!', 'success');
            onSucesso();
            onClose();
=======
            // 🔥 CORREÇÃO CRÍTICA: Enviando 'valor' para o ProdutoDTO do Java
            await api.put(`/produtos/${id}`, {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao
            });

            Swal.fire('Sucesso!', 'Produto atualizado com sucesso!', 'success');
            navigate('/produtos');
>>>>>>> origin/dev-gustavo
        } catch (error) {
            Swal.fire('Erro', 'Falha ao atualizar o produto. Verifique os dados.', 'error');
        }
    };

    return (
<<<<<<< HEAD
        <div style={modalOverlayStyle}>
            <div className="form-produto-container" style={modalContainerStyle}>
=======
        <div className="dashboard-page" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="form-produto-container">
>>>>>>> origin/dev-gustavo
                <h2>Editar Produto - Petit Rose</h2>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Nome do Produto *</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Preço (R$) *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
<<<<<<< HEAD
                        <label>Categoria *</label>
                        <select
                            value={categoriaId}
                            onChange={(e) => setCategoriaId(e.target.value)}
                            required
                        >
                            <option value="">Selecione uma categoria...</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Nova Foto do Produto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImagem}
                            style={{ padding: '8px' }}
                        />
                        {carregandoImagem && <p style={{ fontSize: '12px' }}>Carregando arquivo...</p>}
                    </div>

                    <div className="form-group">
                        <label>Descrição *</label>
                        <textarea
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
=======
                        <label>Descrição</label>
                        <textarea
                            rows={4}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
>>>>>>> origin/dev-gustavo
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
<<<<<<< HEAD
                        <button type="submit" className="btn" style={{ flex: 1 }} disabled={carregandoImagem}>Atualizar Dados</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={onClose}>
=======
                        <button type="submit" className="btn" style={{ flex: 1 }}>Atualizar Dados</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={() => navigate('/produtos')}>
>>>>>>> origin/dev-gustavo
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
<<<<<<< HEAD
};

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 2000
};

const modalContainerStyle: React.CSSProperties = {
    margin: 0, width: '100%', maxWidth: '600px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
=======
>>>>>>> origin/dev-gustavo
};