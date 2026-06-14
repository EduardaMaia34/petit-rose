import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from "./api";
import '../index.css';
import {
    MdAttachMoney,
    MdTrendingDown,
    MdRemove,
    MdShoppingBasket,
    MdStar
} from 'react-icons/md';

interface ItemVendidoDTO {
    produtoNome: string;
    quantidade: number;
    faturamento: number;
}

interface TransacaoResponseDTO {
    id: string;
    tipo: 'ENTRADA' | 'SAIDA';
    item: string;
    valor: number;
    data: string;
    metodoPagamento: string;
}

interface RelatorioFluxoCaixaDTO {
    dataInicio: string;
    dataFim: string;
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
    faturamentoPorMetodoPagamento: Record<string, number>;
    itensMaisVendidos: ItemVendidoDTO[];
    transacoes: TransacaoResponseDTO[];
}

const metodosPagamento = ['PIX', 'DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO'];

export const MenuAdmin = () => {
    const navigate = useNavigate();
    const [dados, setDados] = useState<RelatorioFluxoCaixaDTO | null>(null);
    const [loading, setLoading] = useState(false);

    // Controle do Modal de Registro de Saídas
    const [isModalDespesaAberto, setIsModalDespesaAberto] = useState(false);
    const [itemDescricao, setItemDescricao] = useState('');
    const [valorDespesa, setValorDespesa] = useState('');
    const [metodoSelecionado, setMetodoSelecionado] = useState('DINHEIRO');

    // 1. CARREGAMENTO DOS DADOS DO RELATÓRIO DO BACKEND
    const carregarDashboardGeral = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/relatorios/fluxo-caixa');
            setDados(response.data);
        } catch (error) {
            console.error("Erro ao carregar dados do painel do administrador:", error);
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível buscar os dados financeiros reais.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDashboardGeral();
    }, []);

    // 2. CADASTRO DE DESPESA (SAÍDA) VIA FORMULÁRIO DO MODAL
    const handleSalvarDespesa = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!itemDescricao || !valorDespesa || !metodoSelecionado) {
            Swal.fire({ title: 'Atenção!', text: 'Por favor, preencha todos os campos obrigatórios.', icon: 'warning', confirmButtonColor: '#710100' });
            return;
        }

        try {
            const novaSaidaDTO = {
                tipo: 'SAIDA',
                item: itemDescricao,
                valor: parseFloat(valorDespesa),
                metodoPagamento: metodoSelecionado,
                data: new Date().toISOString()
            };

            await api.post('/transacoes', novaSaidaDTO);

            Swal.fire({
                title: 'Despesa Registrada!',
                text: `A saída "${itemDescricao}" foi guardada com sucesso no fluxo de caixa.`,
                icon: 'success',
                confirmButtonColor: '#710100'
            });

            setItemDescricao('');
            setValorDespesa('');
            setMetodoSelecionado('DINHEIRO');
            setIsModalDespesaAberto(false);
            await carregarDashboardGeral();

        } catch (error) {
            console.error("Erro ao registrar transação de saída:", error);
            Swal.fire('Erro', 'Não foi possível cadastrar a despesa no banco.', 'error');
        }
    };

    // Mapeamento e fallbacks seguros das variáveis vindas do DTO
    const faturamentoMes = dados?.totalEntradas || 0;
    const totalSaidas = dados?.totalSaidas || 0;
    const lucroLiquido = dados?.saldo || 0;
    const produtosMaisVendidos = dados?.itensMaisVendidos || [];
    const movimentacoesRecentes = dados?.transacoes?.slice(0, 5) || [];

    // Filtra e isola os pedidos de ENTRADA para o monitoramento comercial
    const todosPedidos = dados?.transacoes?.filter(t => t.tipo === 'ENTRADA') || [];
    const qtdPedidosRealizados = todosPedidos.length;

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="inicio" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* CABEÇALHO PADRÃO PETIT ROSE */}
                    <div className="dashboard-header" style={{ marginBottom: '0px', width: '100%' }}>
                        <h1 style={{ color: '#710100', fontSize: '1.9rem', fontWeight: 'bold', margin: '0' }}>Bem-vindo(a) ao Petit Rose! </h1>
                        <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0' }}>Acompanhe em tempo real o faturamento, despesas e a saída de produtos da confeitaria.</p>
                    </div>

                    {/* 📊 SEÇÃO 1: CARDS DE RESUMO FINANCEIRO */}
                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '16px', marginBottom: '15px', width: '100%' }}>

                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>Vendas do Mês</span>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MdAttachMoney style={{ fontSize: '1.3rem', color: '#28a745' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#28a745', margin: '0', fontFamily: 'Georgia' }}>
                                    R$ {faturamentoMes.toFixed(2).replace('.', ',')}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: '#8c7a7a', display: 'block', marginTop: '2px' }}>Faturamento bruto total</span>
                            </div>
                        </div>

                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>Pedidos Realizados</span>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MdShoppingBasket style={{ fontSize: '1.2rem', color: '#710100' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#710100', margin: '0', fontFamily: 'Georgia' }}>
                                    {qtdPedidosRealizados}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: '#8c7a7a', display: 'block', marginTop: '2px' }}>Ordens faturadas no mês</span>
                            </div>
                        </div>

                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>Total de Saídas</span>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fff1f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MdTrendingDown style={{ fontSize: '1.3rem', color: '#ff4d4d' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#ff4d4d', margin: '0', fontFamily: 'Georgia' }}>
                                    R$ {totalSaidas.toFixed(2).replace('.', ',')}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: '#8c7a7a', display: 'block', marginTop: '2px' }}>Compras e despesas fixas</span>
                            </div>
                        </div>

                        <div className="stat-box" style={{ padding: '20px 15px', border: '1px solid #f0e6e6', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>Lucro Líquido</span>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MdAttachMoney style={{ fontSize: '1.3rem', color: '#28a745' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#28a745', margin: '0', fontFamily: 'Georgia' }}>
                                    R$ {lucroLiquido.toFixed(2).replace('.', ',')}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: '#8c7a7a', display: 'block', marginTop: '2px' }}>Saldo real em caixa</span>
                            </div>
                        </div>

                    </div>

                    {/* 🛍️ SEÇÃO 2: GRID DE PEDIDOS E RANKING */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', width: '100%', marginBottom: '15px' }}>

                        <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6' }}>
                            <div className="container-header" style={{ marginBottom: '12px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                                <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '22px', fontWeight: 'bold' }}>Últimos Pedidos</h2>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #fff1f1', color: '#6c757d', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '8px 5px' }}>Descrição do Pedido</th>
                                    <th>Método</th>
                                    <th>Data / Hora</th>
                                    <th style={{ textAlign: 'right' }}>Valor</th>
                                </tr>
                                </thead>
                                <tbody>
                                {todosPedidos.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '20px 5px', color: '#6c757d', fontStyle: 'italic', textAlign: 'center' }}>Nenhum pedido faturado no sistema.</td>
                                    </tr>
                                ) : (
                                    todosPedidos.slice(0, 4).map((pedido, idx) => (
                                        <tr key={pedido.id || idx} style={{ borderBottom: '1px solid #fff1f1', fontSize: '0.95rem' }}>
                                            <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#3c1010' }}>{pedido.item}</td>
                                            <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>{pedido.metodoPagamento}</td>
                                            <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>{new Date(pedido.data).toLocaleString('pt-BR')}</td>
                                            <td style={{ fontWeight: 'bold', color: '#28a745', textAlign: 'right' }}>R$ {pedido.valor.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="report-container" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6' }}>
                            <div className="container-header" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MdStar style={{ color: '#710100', fontSize: '1.2rem' }} />
                                <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '20px', fontWeight: 'bold' }}>Produtos Mais Vendidos</h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {produtosMaisVendidos.length === 0 ? (
                                    <p style={{ fontSize: '0.8rem', color: '#6c757d', fontStyle: 'italic' }}>Nenhum doce vendido no período.</p>
                                ) : (
                                    produtosMaisVendidos.slice(0, 4).map((p, idx) => {
                                        const maiorQtd = Math.max(...produtosMaisVendidos.map(m => m.quantidade), 1);
                                        const barraPorcentagem = `${(p.quantidade / maiorQtd) * 100}%`;
                                        return (
                                            <div key={idx}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: '#3c1010', fontWeight: '500' }}>
                                                    <span>{p.produtoNome}</span> <strong>{p.quantidade} un</strong>
                                                </div>
                                                <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: barraPorcentagem, height: '100%', backgroundColor: '#710100', opacity: 1 - (idx * 0.2) }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                    </div>

                    {/* 🧾 SEÇÃO 3: MOVIMENTAÇÕES E AÇÕES DE ATALHO */}
                    <div style={{ width: '100%' }}>

                        <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6' }}>
                            <div
                                className="container-header"
                                style={{
                                    marginBottom: '8px',
                                    borderBottom: '2px solid #fff1f1',
                                    paddingBottom: '6px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <h2
                                    style={{
                                        color: '#710100',
                                        margin: '0',
                                        fontFamily: 'Abhaya Libre',
                                        fontSize: '22px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Movimentações Recentes
                                </h2>

                                <button
                                    onClick={() => setIsModalDespesaAberto(true)}
                                    style={{
                                        backgroundColor: '#710100',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 15px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <MdRemove />
                                    Registrar Saída
                                </button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #fff1f1', color: '#6c757d', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '8px 5px' }}>Fluxo</th>
                                    <th>Item / Descrição</th>
                                    <th>Método</th>
                                    <th>Valor</th>
                                </tr>
                                </thead>
                                <tbody>
                                {movimentacoesRecentes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '20px 5px', color: '#6c757d', fontStyle: 'italic', textAlign: 'center' }}>Nenhuma transação efetuada.</td>
                                    </tr>
                                ) : (
                                    movimentacoesRecentes.map((transacao, idx) => (
                                        <tr key={transacao.id || idx} style={{ borderBottom: '1px solid #fff1f1', fontSize: '0.95rem' }}>
                                            <td style={{ padding: '12px 5px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', minWidth: '65px', padding: '3px 8px', borderRadius: '6px', backgroundColor: transacao.tipo === 'ENTRADA' ? '#e6f7ed' : '#fff1f1', color: transacao.tipo === 'ENTRADA' ? '#28a745' : '#ff4d4d' }}>
                                                    {transacao.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 'bold', color: '#3c1010' }}>{transacao.item}</td>
                                            <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>{transacao.metodoPagamento}</td>
                                            <td style={{ fontWeight: 'bold', color: transacao.tipo === 'ENTRADA' ? '#28a745' : '#710100' }}>
                                                {transacao.tipo === 'ENTRADA' ? `+ R$ ${transacao.valor.toFixed(2)}` : `- R$ ${transacao.valor.toFixed(2)}`}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* MODAL DE CADASTRO DE DESPESA */}
                    {isModalDespesaAberto && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(113, 1, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(3px)' }}>
                            <div className="report-container" style={{ backgroundColor: '#ffffff', padding: '30px', width: '500px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(113, 1, 0, 0.15)', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #f0e6e6' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MdTrendingDown style={{ fontSize: '1.2rem', color: '#710100' }} />
                                        </div>
                                        <h2 style={{ color: '#710100', margin: 0, fontFamily: 'Abhaya Libre', fontSize: '24px', fontWeight: 'bold' }}>Registrar Nova Despesa</h2>
                                    </div>
                                    <button onClick={() => setIsModalDespesaAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
                                </div>

                                <form onSubmit={handleSalvarDespesa} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Descrição da Despesa *</label>
                                        <input type="text" placeholder="Ex: Compra de 10kg de Chocolate Meio Amargo" value={itemDescricao} onChange={(e) => setItemDescricao(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Valor (R$) *</label>
                                            <input type="number" step="0.01" placeholder="0,00" value={valorDespesa} onChange={(e) => setValorDespesa(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <label style={{ fontWeight: '600', fontSize: '0.85rem', color: '#6c757d' }}>Método de Pagamento *</label>
                                            <select value={metodoSelecionado} onChange={(e) => setMetodoSelecionado(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.95rem', backgroundColor: '#fff', color: '#495057' }}>
                                                {metodosPagamento.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
                                            </select>
                                        </div>
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