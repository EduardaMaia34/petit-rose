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

    useEffect(() => {
        const carregarDadosEDependencias = async () => {
            try {
                // 1. Busca todas as categorias para preencher o select
                const responseCategorias = await api.get('/categorias');
                setCategorias(responseCategorias.data);

                // 2. Busca o produto específico para editar
                const responseProduto = await api.get(`/produtos/${produtoId}`);
                setNome(responseProduto.data.nome);

                if (responseProduto.data.valor !== undefined && responseProduto.data.valor !== null) {
                    setValor(responseProduto.data.valor.toString());
                } else {
                    setValor('0.00');
                }

                setDescricao(responseProduto.data.descricao || '');

                // Vincula o ID da categoria atual do produto para selecioná-la no <select>
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !valor || !categoriaId) {
            Swal.fire('Aviso', 'Preencha os campos obrigatórios (*)', 'warning');
            return;
        }

        try {
            await api.put(`/produtos/${produtoId}`, {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao.trim() === '' ? 'Sem descrição fornecida.' : descricao,
                categoriaId: categoriaId
            });

            Swal.fire('Sucesso!', 'Produto atualizado com sucesso!', 'success');
            onSucesso();
            onClose();
        } catch (error) {
            Swal.fire('Erro', 'Falha ao atualizar o produto. Verifique os dados.', 'error');
        }
    };

    return (
        <div style={modalOverlayStyle}>
            <div className="form-produto-container" style={modalContainerStyle}>
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

                    {/* CAIXA DE SELEÇÃO DE CATEGORIAS NA EDIÇÃO */}
                    <div className="form-group">
                        <label>Categoria *</label>
                        <select
                            value={categoriaId}
                            onChange={(e) => setCategoriaId(e.target.value)}
                            required
                            style={selectStyle}
                        >
                            <option value="">Selecione uma categoria...</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Descrição *</label>
                        <textarea
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>Atualizar Dados</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={onClose}>
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 2000
};

const modalContainerStyle: React.CSSProperties = {
    margin: 0, width: '100%', maxWidth: '600px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
};

const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px', borderRadius: '5px',
    border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '14px'
};