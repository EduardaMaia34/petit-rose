import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from './api';
import '../index.css';

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
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [imagemAtualUrl, setImagemAtualUrl] = useState<string | null>(null);
    const [novaImagemFile, setNovaImagemFile] = useState<File | null>(null);
    const [previewNovaImagem, setPreviewNovaImagem] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const carregarCategorias = async () => {
                try {
                    const response = await api.get('/categorias');
                    setCategorias(response.data);
                } catch (error) {
                    console.error("Erro ao carregar categorias:", error);
                }
            };
            carregarCategorias();
        }

        if (isOpen && produtoId) {
            const carregarProduto = async () => {
                try {
                    const response = await api.get(`/produtos/${produtoId}`);
                    setNome(response.data.nome);
                    setValor(response.data.valor ? response.data.valor.toString() : '');
                    setDescricao(response.data.descricao || '');
                    setCategoriaId(response.data.categoria?.id || '');

                    setImagemAtualUrl(response.data.imagemUrl || null);
                    setNovaImagemFile(null);
                    setPreviewNovaImagem(null);
                } catch (error) {
                    Swal.fire('Erro', 'Não foi possível carregar os dados do produto.', 'error');
                    onClose();
                }
            };
            carregarProduto();
        }
    }, [isOpen, produtoId]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNovaImagemFile(file);
            setPreviewNovaImagem(URL.createObjectURL(file));
        }
    };

    const handleRemoverImagemCompleta = () => {
        setImagemAtualUrl(null);
        setNovaImagemFile(null);
        setPreviewNovaImagem(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let nomeImagemFinal = imagemAtualUrl;

            if (novaImagemFile) {
                const formData = new FormData();
                formData.append('imagem', novaImagemFile);
                const uploadResponse = await api.post('/produtos/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                nomeImagemFinal = uploadResponse.data.nomeArquivo || uploadResponse.data.imagemUrl;
            }

            await api.put(`/produtos/${produtoId}`, {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao.trim() === '' ? 'Sem descrição fornecida.' : descricao,
                categoriaId: categoriaId,
                imagemUrl: nomeImagemFinal
            });

            Swal.fire('Atualizado!', 'Produto modificado com sucesso.', 'success');
            onSucesso();
            onClose();
        } catch (error) {
            Swal.fire('Erro', 'Erro ao tentar atualizar o produto.', 'error');
        }
    };

    return (
        <div style={modalOverlayStyle}>
            {/* O Modal voltou ao tamanho normal (maxWidth: 550px) e com rolagem caso a tela seja muito baixa */}
            <div className="form-produto-container" style={{ ...modalContainerStyle, maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>Editar Produto - Petit Rose</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Nome do Produto *</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label>Preço (R$) *</label>
                            <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
                        </div>

                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label>Categoria *</label>
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-p)', border: '1px solid #ccc', height: '42px', backgroundColor: '#fff' }}
                            >
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Imagem do Produto</label>

                        {previewNovaImagem ? (
                            <div style={containerFotoPequenaStyle}>
                                <img src={previewNovaImagem} alt="Nova Preview" style={imgCardStyle} />
                                <button
                                    type="button"
                                    onClick={handleRemoverImagemCompleta}
                                    style={{ ...btnAcaoImagemStyle, backgroundColor: 'var(--vinho-texto)', width: '120px' }}
                                >
                                    Remover Foto
                                </button>
                            </div>
                        ) : (
                            imagemAtualUrl ? (
                                <div style={containerFotoPequenaStyle}>
                                    <img src={`http://localhost:8081/uploads/${imagemAtualUrl}`} alt="Atual" style={imgCardStyle} />

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%' }}>
                                        <label style={{ ...btnAcaoImagemStyle, ...btnUploadRosaStyle, width: '100%' }}>
                                            Alterar Foto
                                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleRemoverImagemCompleta}
                                            style={{ ...btnAcaoImagemStyle, backgroundColor: 'var(--vinho-texto)', width: '100%' }}
                                        >
                                            Remover Foto
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label style={{ ...btnUploadRosaStyle, display: 'block', padding: '12px', textAlign: 'center', borderRadius: 'var(--radius-p)', cursor: 'pointer', fontWeight: 'bold' }}>
                                    + Adicionar Foto
                                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                            )
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Descrição *</label>
                        <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button type="button" onClick={onClose} className="btn-voltar" style={{ flex: 1, backgroundColor: 'var(--vinho-texto)', color: '#fff', margin: 0, padding: '12px' }}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-padrao" style={{ flex: 1, margin: 0, padding: '12px' }}>
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ESTILOS */

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 2000, padding: '20px', boxSizing: 'border-box'
};

const modalContainerStyle: React.CSSProperties = {
    margin: 0, width: '100%', maxWidth: '550px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
};

const btnUploadRosaStyle: React.CSSProperties = {
    backgroundColor: 'var(--rosa-principal)', color: 'var(--vinho-texto)'
};

const btnAcaoImagemStyle: React.CSSProperties = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 'var(--radius-p)',
    textAlign: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    border: 'none',
    height: '34px',
    boxSizing: 'border-box'
};

// NOVO: Container compacto para a foto e botões ficarem alinhados de forma discreta
const containerFotoPequenaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid var(--rosa-escuro)',
    padding: '10px',
    borderRadius: 'var(--radius-p)',
    backgroundColor: '#fff'
};

// NOVO: A foto agora é menor e fica no cantinho esquerdo do container
const imgCardStyle: React.CSSProperties = {
    width: '100px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px'
};