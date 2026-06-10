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

    // Carrega as categorias do banco de dados ao abrir o modal
    useEffect(() => {
        const carregarCategorias = async () => {
            try {
                // Altere para a sua rota real de categorias se for diferente de '/categorias'
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !valor || !categoriaId) {
            Swal.fire('Aviso', 'Preencha todos os campos obrigatórios (*)', 'warning');
            return;
        }

        try {
            await api.post('/produtos', {
                nome: nome,
                valor: parseFloat(valor),
                // Como o DTO tem @NotBlank na descrição, garantimos que não vá vazia
                descricao: descricao.trim() === '' ? 'Sem descrição fornecida.' : descricao,
                categoriaId: categoriaId
            });

            Swal.fire('Sucesso!', 'Produto cadastrado com sucesso!', 'success');

            // Limpa o estado
            setNome('');
            setValor('');
            setDescricao('');
            setCategoriaId('');

            onSucesso();
            onClose();
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível cadastrar o produto. Verifique os dados.', 'error');
        }
    };

    return (
        <div style={modalOverlayStyle}>
            <div className="form-produto-container" style={modalContainerStyle}>
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

                    {/* NOVA CAIXA DE SELEÇÃO DE CATEGORIAS */}
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
                            placeholder="Escreva detalhes sobre o produto..."
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>Salvar Produto</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={onClose}>
                            Cancelar
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