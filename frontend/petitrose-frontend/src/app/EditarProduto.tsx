import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from './api';
import '../index.css';

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
                } else {
                    setValor('0.00');
                }

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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !valor) {
            Swal.fire('Aviso', 'Preencha os campos obrigatórios (*)', 'warning');
            return;
        }

        try {
            // 🔥 CORREÇÃO CRÍTICA: Enviando 'valor' para o ProdutoDTO do Java
            await api.put(`/produtos/${id}`, {
                nome: nome,
                valor: parseFloat(valor),
                descricao: descricao
            });

            Swal.fire('Sucesso!', 'Produto atualizado com sucesso!', 'success');
            navigate('/produtos');
        } catch (error) {
            Swal.fire('Erro', 'Falha ao atualizar o produto. Verifique os dados.', 'error');
        }
    };

    return (
        <div className="dashboard-page" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="form-produto-container">
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
                        <label>Descrição</label>
                        <textarea
                            rows={4}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>Atualizar Dados</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={() => navigate('/produtos')}>
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};