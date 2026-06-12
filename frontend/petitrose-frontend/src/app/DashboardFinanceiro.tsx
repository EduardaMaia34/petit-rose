import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';
import { MdAttachMoney, MdTrendingDown, MdAccountBalance, MdRemove, MdCheckCircle } from 'react-icons/md';

const categoriasDespesa = [
    { id: 'materia-prima', nome: 'Matéria-prima (Insumos)' },
    { id: 'embalagens', nome: 'Embalagens e Fitas' },
    { id: 'infraestrutura', nome: 'Custos Fixos (Energia, Água)' },
    { id: 'equipamentos', nome: 'Equipamentos e Utensílios' },
    { id: 'outros', nome: 'Outros' }
];

const resumoFinanceiroInicial = [
    { id: 1, titulo: 'Total de Entradas (Vendas)', valor: 8950.00, detalhe: 'Referente ao mês atual', icone: <MdAttachMoney style={{ fontSize: '1.5rem', color: '#28a745' }} />, bgIcone: '#e6f7ed', corValor: '#28a745' },
    { id: 2, titulo: 'Total de Saídas (Despesas)', valor: 3120.00, detalhe: 'Compras de insumos e custos', icone: <MdTrendingDown style={{ fontSize: '1.5rem', color: '#ff4d4d' }} />, bgIcone: '#fff1f1', corValor: '#ff4d4d' },
    { id: 3, titulo: 'Saldo em Caixa', valor: 5830.00, detalhe: 'Lucro real disponível', icone: <MdAccountBalance style={{ fontSize: '1.5rem', color: '#710100' }} />, bgIcone: '#fdf2f2', corValor: '#710100' },
];

const transacoesIniciais = [
    { id: 'TR-051', tipo: 'Entrada', descricao: 'Pedido #120 (Bolo de Morango + Cupcakes)', data: '04/06/2026', valor: 85.00, categoria: 'Venda Balcão', classe: 'status-pago', corTexto: '#28a745', corFundo: '#e6f7ed' },
    { id: 'TR-052', tipo: 'Entrada', descricao: 'Pedido #121 (Combo Brigadeiros)', data: '04/06/2026', valor: 42.00, categoria: 'Venda Balcão', classe: 'status-pago', corTexto: '#28a745', corFundo: '#e6f7ed' },
    { id: 'TR-053', tipo: 'Saída', descricao: 'Compra de Insumos (Leite condensado e farinha)', data: '03/06/2026', valor: 450.00, categoria: 'Matéria-prima', classe: 'status-preparo', corTexto: '#710100', corFundo: '#fdf2f2' },
    { id: 'TR-054', tipo: 'Saída', descricao: 'Embalagens para Doces e Tortas', data: '02/06/2026', valor: 180.00, categoria: 'Embalagens', classe: 'status-preparo', corTexto: '#710100', corFundo: '#fdf2f2' },
    { id: 'TR-055', tipo: 'Entrada', descricao: 'Pedido #119 (Encomenda Cento de Salgados)', data: '02/06/2026', valor: 150.00, categoria: 'Encomenda', classe: 'status-pago', corTexto: '#28a745', corFundo: '#e6f7ed' },
];

export const DashboardFinanceiro = () => {
    const navigate = useNavigate();

    const [transacoes, setTransacoes] = useState(transacoesIniciais);
    const [resumo, setResumo] = useState(resumoFinanceiroInicial);

    const [isModalDespesaAberto, setIsModalDespesaAberto] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');
    const [categoria, setCategoria] = useState('');
    const [observacao, setObservacao] = useState('');

    const handleSalvarDespesa = (e: React.FormEvent) => {
        e.preventDefault();

        if (!descricao || !valor || !data || !categoria) {
            Swal.fire({ title: 'Atenção!', text: 'Por favor, preencha todos os campos obrigatórios.', icon: 'warning', confirmButtonColor: '#710100' });
            return;
        }

        const valorNum = parseFloat(valor);
        const novoId = `TR-0${transacoes.length + 51}`;
        const catObj = categoriasDespesa.find(c => c.id === categoria);

        const novaTransacao = {
            id: novoId,
            tipo: 'Saída',
            descricao,
            data: data.split('-').reverse().join('/'),
            valor: valorNum,
            categoria: catObj ? catObj.nome : 'Outros',
            classe: 'status-preparo',
            corTexto: '#710100',
            corFundo: '#fdf2f2'
        };

        setTransacoes([novaTransacao, ...transacoes]);

        setResumo(prevResumo =>
            prevResumo.map(item => {
                if (item.id === 2) return { ...item, valor: item.valor + valorNum };
                if (item.id === 3) return { ...item, valor: item.valor - valorNum };
                return item;
            })
        );

        Swal.fire({ title: 'Despesa Registrada!', text: 'A saída foi computada com sucesso no fluxo de caixa.', icon: 'success', confirmButtonColor: '#710100' });

        setDescricao('');
        setValor('');
        setData('');
        setCategoria('');
        setObservacao('');
        setIsModalDespesaAberto(false);
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="relatorios" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* CABEÇALHO ULTRA COMPACTO */}
                    <div className="dashboard-header" style={{ marginBottom: '-10px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.7rem', fontWeight: 'bold', margin: '0' }}>Gestão Financeira</h1>
                            <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0', fontSize: '0.85rem' }}>Controle de fluxo de caixa, entradas de pedidos e saídas de insumos do Petit Rose.</p>
                        </div>
                    </div>

                    {/* GRID DE CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginTop: '4px', marginBottom: '12px', width: '100%' }}>
                        {resumo.map((card) => (
                            <div key={card.id} className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>{card.titulo}</span>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: card.bgIcone, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
                                        {card.icone}
                                    </div>
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    <p style={{ fontSize: '1.7rem', fontWeight: 'bold', color: card.corValor, margin: '0', fontFamily: 'Georgia' }}>
                                        R$ {card.valor.toFixed(2).replace('.', ',')}
                                    </p>
                                    <span style={{ fontSize: '0.75rem', color: '#8c7a7a', display: 'block', marginTop: '2px' }}>{card.detalhe}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEÇÃO INFERIOR */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', width: '100%' }}>

                        {/* COLUNA DA ESQUERDA: LISTA DE MOVIMENTAÇÕES */}
                        <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div className="container-header" style={{ marginBottom: '8px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '24px' }}>Movimentações Recentes</h2>
                                {/* Apenas o botão necessário de Saída */}
                                <button className="btn btn-sm" style={{ backgroundColor: '#710100', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }} onClick={() => setIsModalDespesaAberto(true)}>
                                    <MdRemove /> Registrar Saída
                                </button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #fff1f1', color: '#6c757d', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '8px 5px' }}>Cód</th>
                                    <th>Tipo</th>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th>Data</th>
                                    <th>Valor</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transacoes.map((transacao) => (
                                    <tr key={transacao.id} style={{ borderBottom: '1px solid #fff1f1', fontSize: '0.95rem' }}>
                                        <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#6c757d' }}>{transacao.id}</td>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', minWidth: '65px', padding: '3px 8px', borderRadius: '6px', backgroundColor: transacao.corFundo, color: transacao.corTexto }}>
                                                {transacao.tipo}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 'bold', color: '#3c1010' }}>{transacao.descricao}</td>
                                        <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>{transacao.categoria}</td>
                                        <td style={{ color: '#6c757d' }}>{transacao.data}</td>
                                        <td style={{ fontWeight: 'bold', color: transacao.tipo === 'Entrada' ? '#28a745' : '#710100' }}>
                                            {transacao.tipo === 'Entrada' ? `+ R$ ${transacao.valor.toFixed(2).replace('.', ',')}` : `- R$ ${transacao.valor.toFixed(2).replace('.', ',')}`}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* COLUNA DA DIREITA */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="report-container" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div className="container-header" style={{ marginBottom: '6px' }}>
                                    <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '20px' }}>Verificação de Caixa</h2>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#6c757d', margin: '6px 0', lineHeight: '1.4' }}>
                                    Alinhado com as metas de teste da <strong>Sprint 5</strong> para verificar se o saldo bate com os pedidos.
                                </p>
                                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#e6f7ed', borderLeft: '4px solid #28a745', fontSize: '0.8rem', color: '#1e5e3a', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                                    <MdCheckCircle style={{ fontSize: '1.1rem', color: '#28a745' }} /> Caixa Conciliado (100% batendo)
                                </div>
                            </div>

                            <div className="report-container" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div className="container-header" style={{ marginBottom: '12px' }}>
                                    <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '20px' }}>Maiores Gastos (Mês)</h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: '#3c1010', fontWeight: '500' }}>
                                            <span>Laticínios (Moça / Nestlé)</span> <strong>45%</strong>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: '45%', height: '100%', backgroundColor: '#710100' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: '#3c1010', fontWeight: '500' }}>
                                            <span>Embalagens e Laços</span> <strong>25%</strong>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: '25%', height: '100%', backgroundColor: '#710100' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* MODAL DE CADASTRO DE DESPESA */}
                    {isModalDespesaAberto && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(113, 1, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(3px)' }}>
                            <div className="report-container" style={{ backgroundColor: '#ffffff', padding: '30px', width: '500px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(113, 1, 0, 0.15)', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #f0e6e6' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <h2 style={{ color: 'var(--vinho-texto)', margin: 0, fontFamily: 'Abhaya Libre', fontSize: '24px' }}>
                                        📉 Registrar Nova Despesa
                                    </h2>
                                    <button onClick={() => setIsModalDespesaAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
                                </div>

                                <form onSubmit={handleSalvarDespesa} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Descrição da Despesa *</label>
                                        <input type="text" placeholder="Ex: Compra de 10kg de Chocolate" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Valor (R$) *</label>
                                            <input type="number" step="0.01" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Data de Pagamento *</label>
                                            <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', color: '#495057' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Categoria *</label>
                                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', backgroundColor: '#fff', color: '#495057' }}>
                                            <option value="">Selecione uma categoria...</option>
                                            {categoriasDespesa.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Observações Adicionais</label>
                                        <textarea rows={2} placeholder="Ex: Fornecedor X" value={observacao} onChange={(e) => setObservacao(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', resize: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px', borderTop: '2px solid #fff1f1', paddingTop: '15px' }}>
                                        <button type="button" onClick={() => setIsModalDespesaAberto(false)} className="status-btn-em-preparo" style={{ backgroundColor: '#f5f5f5', color: '#6c757d', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="status-btn-pagamento" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                            Confirmar Saída
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};