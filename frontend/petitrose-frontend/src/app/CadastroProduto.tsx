import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { api } from './api';
import '../index.css';

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
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [imagem, setImagem] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Carrega as categorias do banco quando o modal abre
    useEffect(() => {
        if (isOpen) {
            const carregarCategorias = async () => {
                try {
                    const response = await api.get('/categorias');
                    setCategorias(response.data);
                    if (response.data.length > 0) {
                        setCategoriaId(response.data[0].id);
                    }
                } catch (error) {
                    console.error("Erro ao carregar categorias:", error);
                }
            };
            carregarCategorias();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagem(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoverImagem = () => {
        setImagem(null);
        setPreviewUrl(null);
    };

    // FUNÇÃO DE LIMPEZA CRÍTICA: Reseta os estados e fecha o modal de forma limpa
    const handleFecharModal = () => {
        setNome('');
        setValor('');
        setDescricao('');
        setImagem(null);
        setPreviewUrl(null);
        onClose(); // Propaga o fechamento para o componente pai
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !valor || !categoriaId) {
            Swal.fire('Aviso', 'Preencha todos os campos obrigatórios (*)', 'warning');
            return;
        }

        try {
            let nomeImagemSalva = '';

            if (imagem) {
                const formData = new FormData();
                formData.append('imagem', imagem);
                const uploadResponse = await api.post('/produtos/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                nomeImagemSalva = uploadResponse.data.nomeArquivo || uploadResponse.data.imagemUrl;
            }

            await api.post('/produtos', {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao.trim() === '' ? 'Sem descrição fornecida.' : descricao,
                categoriaId: categoriaId,
                imagemUrl: nomeImagemSalva || null
            });

            Swal.fire('Sucesso!', 'Produto cadastrado com sucesso!', 'success');

            // Notifica a listagem para recarregar e fecha limpando tudo
            onSucesso();
            handleFecharModal();
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível cadastrar o produto.', 'error');
        }
    };

    return (
        <div style={modalOverlayStyle}>
            <div className="form-produto-container" style={{ ...modalContainerStyle, maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>Novo Produto</h2>

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
                        {!previewUrl ? (
                            <label style={{ ...btnUploadRosaStyle, display: 'block', padding: '12px', textAlign: 'center', borderRadius: 'var(--radius-p)', cursor: 'pointer', fontWeight: 'bold' }}>
                                📷 Selecionar Imagem
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        ) : (
                            <div style={containerFotoPequenaStyle}>
                                <img src={previewUrl} alt="Preview" style={imgCardStyle} />
                                <button
                                    type="button"
                                    onClick={handleRemoverImagem}
                                    style={{ ...btnAcaoImagemStyle, backgroundColor: 'var(--vinho-texto)', width: '120px' }}
                                >
                                    Remover Foto
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Descrição *</label>
                        <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        {/* Modificado para disparar o handleFecharModal e limpar o estado da foto */}
                        <button
                            type="button"
                            onClick={handleFecharModal}
                            className="btn-voltar"
                            style={{ flex: 1, backgroundColor: 'var(--vinho-texto)', color: '#fff', margin: 0, padding: '12px' }}
                        >
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

/* ESTILOS INTERNOS */

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

const containerFotoPequenaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    border: '1px solid var(--rosa-escuro)',
    padding: '10px',
    borderRadius: 'var(--radius-p)',
    backgroundColor: '#fff'
};

const imgCardStyle: React.CSSProperties = {
    width: '100px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px'
};