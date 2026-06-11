<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
>>>>>>> origin/dev-gustavo
import Swal from 'sweetalert2';
import { api } from './api';
import '../index.css';

<<<<<<< HEAD
interface Categoria {
    id: string;
    nome: string;
}

interface CadastroProdutoProps {
    isOpen: boolean;
    onClose: () => void;
    onSucesso: () => void;
}

export const CadastroProduto: React.FC<CadastroProdutoProps> = ({ isOpen, onClose, onSucesso }) => {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregandoImagem, setCarregandoImagem] = useState(false);

    useEffect(() => {
        const carregarCategorias = async () => {
            try {
                const response = await api.get('/categorias');
                setCategorias(response.data);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
            }
        };

        if (isOpen) {
            carregarCategorias();
        }
    }, [isOpen]);

    if (!isOpen) return null;

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
            Swal.fire('Sucesso', 'Imagem enviada com sucesso!', 'success');
        } catch (error) {
            Swal.fire('Erro', 'Falha ao processar o upload da imagem.', 'error');
        } finally {
            setCarregandoImagem(false);
        }
    };
=======
export const CadastroProduto = () => {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState(''); // Alterado de preco para valor
    const [descricao, setDescricao] = useState('');
    const navigate = useNavigate();
>>>>>>> origin/dev-gustavo

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

<<<<<<< HEAD
        if (!nome || !valor || !categoriaId) {
=======
        if (!nome || !valor) {
>>>>>>> origin/dev-gustavo
            Swal.fire('Aviso', 'Preencha todos os campos obrigatórios (*)', 'warning');
            return;
        }

        try {
<<<<<<< HEAD
            await api.post('/produtos', {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao.trim() === '' ? 'Sem descrição fornecida.' : descricao,
                categoriaId: categoriaId,
                imagemUrl: imagemUrl // Vincula o arquivo retornado do backend
            });

            Swal.fire('Sucesso!', 'Produto cadastrado com sucesso!', 'success');

            setNome('');
            setValor('');
            setDescricao('');
            setCategoriaId('');
            setImagemUrl('');

            onSucesso();
            onClose();
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível cadastrar o produto.', 'error');
=======
            // 🔥 CORREÇÃO CRÍTICA: Chave alterada de 'preco' para 'valor'
            await api.post('/produtos', {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao // Mantenha se o seu DTO tiver, se não tiver pode remover
            });

            Swal.fire('Sucesso!', 'Produto cadastrado com sucesso!', 'success');
            navigate('/produtos');
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível cadastrar o produto. Verifique os dados.', 'error');
>>>>>>> origin/dev-gustavo
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
                <h2>Novo Produto - Petit Rose</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome do Produto *</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Ex: Brigadeiro de Pistache"
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
                            placeholder="0.00"
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

                    {/* CAMPO DE SELEÇÃO DE IMAGEM */}
                    <div className="form-group">
                        <label>Foto do Produto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImagem}
                            style={{ padding: '8px' }}
                        />
                        {carregandoImagem && <p style={{ fontSize: '12px', color: 'var(--vinho-texto)' }}>Carregando arquivo...</p>}
                        {imagemUrl && <p style={{ fontSize: '12px', color: 'green' }}>✓ Imagem pronta para salvar ({imagemUrl.substring(0,20)}...)</p>}
                    </div>

                    <div className="form-group">
                        <label>Descrição *</label>
                        <textarea
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Detalhes opcionais..."
                            required
=======
                        <label>Descrição</label>
                        <textarea
                            rows={4}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Detalhes opcionais..."
>>>>>>> origin/dev-gustavo
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
<<<<<<< HEAD
                        <button type="submit" className="btn" style={{ flex: 1 }} disabled={carregandoImagem}>Salvar Produto</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={onClose}>
=======
                        <button type="submit" className="btn" style={{ flex: 1 }}>Salvar Produto</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={() => navigate('/produtos')}>
>>>>>>> origin/dev-gustavo
                            Cancelar
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