import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from './api';
import '../index.css';

export const CadastroProduto = () => {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState(''); // Alterado de preco para valor
    const [descricao, setDescricao] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !valor) {
            Swal.fire('Aviso', 'Preencha todos os campos obrigatórios (*)', 'warning');
            return;
        }

        try {
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
        }
    };

    return (
        <div className="dashboard-page" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="form-produto-container">
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
                        <label>Descrição</label>
                        <textarea
                            rows={4}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Detalhes opcionais..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>Salvar Produto</button>
                        <button type="button" className="btn-voltar" style={{ flex: 1 }} onClick={() => navigate('/produtos')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};