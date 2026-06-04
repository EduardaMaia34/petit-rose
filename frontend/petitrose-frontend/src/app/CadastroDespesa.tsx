import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2'; // Aproveitando o SweetAlert2 que você já usa na Navbar!
import '../index.css';

// Categorias mockadas comuns para uma confeitaria
const categoriasDespesa = [
    { id: 'materia-prima', nome: 'Matéria-prima (Insumos)' },
    { id: 'embalagens', nome: 'Embalagens e Fitas' },
    { id: 'infraestrutura', nome: 'Custos Fixos (Energia, Água, Internet)' },
    { id: 'equipamentos', nome: 'Equipamentos e Utensílios' },
    { id: 'outros', nome: 'Outros' }
];

export const CadastroDespesa = () => {
    const navigate = useNavigate();

    // Estados para simular o formulário localmente
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');
    const [categoria, setCategoria] = useState('');
    const [observacao, setObservacao] = useState('');

    const handleSalvarDespesa = (e: React.FormEvent) => {
        e.preventDefault();

        // Validação simples de frontend
        if (!descricao || !valor || !data || !categoria) {
            Swal.fire({
                title: 'Atenção!',
                text: 'Por favor, preencha todos os campos obrigatórios.',
                icon: 'warning',
                confirmButtonColor: '#710100'
            });
            return;
        }

        // Simulação de salvamento com sucesso (Substituir pela rota da API Java futuramente)
        Swal.fire({
            title: 'Despesa Registrada!',
            text: 'A saída de dinheiro foi computada com sucesso no fluxo de caixa.',
            icon: 'success',
            confirmButtonColor: '#710100'
        }).then(() => {
            // Limpa o formulário ou redireciona de volta para o Dashboard Financeiro
            navigate('/dashboard-financeiro');
        });
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="relatorios" />

            <div className="main-container">
                <div className="content-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>

                    {/* CONTAINER DO FORMULÁRIO */}
                    <div className="report-container" style={{ padding: '30px' }}>
                        <div className="container-header" style={{ marginBottom: '20px', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px' }}>
                            <h2 style={{ color: '#710100' }}>Registrar Nova Despesa / Saída</h2>
                        </div>

                        <form onSubmit={handleSalvarDespesa} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* DESCRIÇÃO */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontWeight: '500', fontSize: '0.95rem', color: '#6c757d' }}>
                                    Descrição da Despesa *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Compra de 10kg de Chocolate Meio Amargo"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem' }}
                                />
                            </div>

                            {/* GRUPO DE DOIS CAMPOS (VALOR E DATA) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {/* VALOR */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontWeight: '500', fontSize: '0.95rem', color: '#6c757d' }}>
                                        Valor (R$) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem' }}
                                    />
                                </div>

                                {/* DATA VENCIMENTO/PAGAMENTO */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontWeight: '500', fontSize: '0.95rem', color: '#6c757d' }}>
                                        Data de Pagamento *
                                    </label>
                                    <input
                                        type="date"
                                        value={data}
                                        onChange={(e) => setData(e.target.value)}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem', color: '#495057' }}
                                    />
                                </div>
                            </div>

                            {/* CATEGORIA */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontWeight: '500', fontSize: '0.95rem', color: '#6c757d' }}>
                                    Categoria *
                                </label>
                                <select
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: '#fff', color: '#495057' }}
                                >
                                    <option value="">Selecione uma categoria...</option>
                                    {categoriasDespesa.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>

                            {/* OBSERVAÇÕES */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontWeight: '500', fontSize: '0.95rem', color: '#6c757d' }}>
                                    Observações Adicionais
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Ex: Nota fiscal enviada por e-mail, fornecedor X"
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem', resize: 'vertical' }}
                                />
                            </div>

                            {/* BOTÕES DE AÇÃO */}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard-financeiro')}
                                    className="btn btn-sm"
                                    style={{ backgroundColor: '#6c757d', color: '#fff' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm"
                                >
                                    Confirmar Saída 📉
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};