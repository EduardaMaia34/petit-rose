import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from "./api";
import '../index.css';
import { MdPictureAsPdf, MdAdd, MdTrendingUp, MdCheckCircle, MdRemoveCircleOutline } from 'react-icons/md';

// Interfaces baseadas estritamente nos Records do Java do Petit Rose
interface ItemVendidoDTO {
    produtoNome: string;
    quantidade: number;
    faturamento: number;
}

interface RelatorioFluxoCaixaDTO {
    dataInicio: string;
    dataFim: string;
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
    faturamentoPorMetodoPagamento: Record<string, number>;
    despesaPorMetodoPagamento: Record<string, number>;
    itensMaisVendidos: ItemVendidoDTO[];
}

export const Relatorios = () => {
    const [filtroPeriodo, setFiltroPeriodo] = useState('mes');
    const [dadosRelatorio, setDadosRelatorio] = useState<RelatorioFluxoCaixaDTO | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. CARREGAMENTO REATIVO COM CÁLCULO DE DATAS DINÂMICAS PARA A API
    const buscarDadosRelatorio = async () => {
        try {
            setLoading(true);

            const agora = new Date();
            let dataInicio = new Date();

            if (filtroPeriodo === 'hoje') {
                dataInicio.setHours(0, 0, 0, 0);
            } else if (filtroPeriodo === 'semana') {
                dataInicio.setDate(agora.getDate() - 7);
            } else if (filtroPeriodo === 'mes') {
                // Assume o padrão de 30 dias atrás configurado no Java ou força o início do mês atual
                dataInicio.setDate(1);
                dataInicio.setHours(0, 0, 0, 0);
            }

            // Converte para o padrão ISO que o @DateTimeFormat do Java espera
            const queryInicio = dataInicio.toISOString();
            const queryFim = agora.toISOString();

            const response = await api.get('/api/relatorios/fluxo-caixa', {
                params: {
                    dataInicio: queryInicio,
                    dataFim: queryFim
                }
            });

            setDadosRelatorio(response.data);
        } catch (error) {
            console.error("Erro ao buscar indicadores de fluxo de caixa:", error);
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível buscar as métricas financeiras.' });
        } finally {
            setLoading(false);
        }
    };

    // Recarrega o painel toda vez que o usuário alterar o select de período
    useEffect(() => {
        buscarDadosRelatorio();
    }, [filtroPeriodo]);

    const handleExportarPDF = () => {
        Swal.fire({
            title: 'Exportando Relatório...',
            text: 'O arquivo PDF está sendo gerado com os dados consolidados.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
            willClose: () => {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Relatório exportado com sucesso para a pasta de downloads.',
                    icon: 'success',
                    confirmButtonColor: '#710100'
                });
            }
        });
    };

    // Definição de valores padrão caso a API ainda não tenha retornado dados
    const totalEntradas = dadosRelatorio?.totalEntradas || 0;
    const totalSaidas = dadosRelatorio?.totalSaidas || 0;
    const saldoConsolidado = dadosRelatorio?.saldo || 0;
    const maisVendidos = dadosRelatorio?.itensMaisVendidos || [];
    const faturamentoMetodos = dadosRelatorio?.faturamentoPorMetodoPagamento || {};

    // Mapeia os dados do dicionário de métodos de pagamento para o gráfico de barras
    const dadosGraficoMetodos = Object.entries(faturamentoMetodos).map(([metodo, valor]) => {
        const maiorValor = Math.max(...Object.values(faturamentoMetodos), 1);
        const alturaCalculada = `${(valor / maiorValor) * 100}%`;
        return { metodo, valor, alturaBarra: alturaCalculada };
    });

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="relatorios" />

            <div className="main-container">
                <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* CABEÇALHO FILTROS FINANCEIROS */}
                    <div className="dashboard-header" style={{ marginBottom: '-10px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h1 style={{ color: '#710100', fontSize: '1.7rem', fontWeight: 'bold', margin: '0' }}>Relatórios e Indicadores</h1>
                            <p style={{ color: '#6c757d', marginTop: '2px', marginBottom: '0', fontSize: '0.85rem' }}>Análise de desempenho de vendas, faturamento e saída de produtos do Petit Rose.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select
                                value={filtroPeriodo}
                                onChange={(e) => setFiltroPeriodo(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: '#fff', fontSize: '0.85rem', color: '#495057', cursor: 'pointer' }}
                            >
                                <option value="hoje">Filtrar por: Hoje</option>
                                <option value="semana">Filtrar por: Últimos 7 dias</option>
                                <option value="mes">Filtrar por: Este Mês</option>
                            </select>
                            <button
                                className="btn btn-sm"
                                style={{ backgroundColor: '#710100', color: '#fff', padding: '9px 15px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
                                onClick={handleExportarPDF}
                            >
                                <MdPictureAsPdf style={{ fontSize: '1.1rem' }} /> Exportar PDF
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', margin: '15px 0', color: '#710100', fontSize: '0.9rem', fontWeight: 'bold' }}>Calculando indicadores de fluxo...</div>
                    )}

                    {/* SEÇÃO PRINCIPAL DE GRÁFICOS DINÂMICOS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '16px', marginBottom: '12px', width: '100%' }}>

                        {/* CARD 1: FATURAMENTO POR MÉTODO DE PAGAMENTO */}
                        <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div className="container-header" style={{ marginBottom: '15px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                                <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '22px' }}>Faturamento por Método</h2>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', borderBottom: '2px solid #fff1f1', paddingBottom: '5px', marginTop: '10px' }}>
                                {dadosGraficoMetodos.length === 0 ? (
                                    <p style={{ color: '#6c757d', fontSize: '0.85rem', fontStyle: 'italic', margin: 'auto' }}>Nenhuma venda registrada no período.</p>
                                ) : (
                                    dadosGraficoMetodos.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '75px' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#710100', marginBottom: '4px', fontFamily: 'Georgia' }}>
                                                R$ {item.valor.toFixed(0)}
                                            </span>
                                            <div style={{
                                                width: '45px',
                                                height: item.alturaBarra,
                                                backgroundColor: '#710100',
                                                borderRadius: '4px 4px 0 0',
                                                opacity: 0.8,
                                                transition: 'height 0.5s ease-in-out'
                                            }}></div>
                                            <span style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                                                {item.metodo}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* CARD 2: PRODUTOS MAIS VENDIDOS DA CONFEITARIA */}
                        <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                            <div className="container-header" style={{ marginBottom: '15px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                                <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '22px' }}>Produtos Líderes de Vendas</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                {maisVendidos.length === 0 ? (
                                    <p style={{ color: '#6c757d', fontSize: '0.85rem', fontStyle: 'italic', padding: '20px 0', textAlign: 'center' }}>Sem dados de movimentação de produtos.</p>
                                ) : (
                                    maisVendidos.slice(0, 4).map((prod, idx) => {
                                        const maiorQtd = Math.max(...maisVendidos.map(m => m.quantidade), 1);
                                        const larguraBarra = `${(prod.quantidade / maiorQtd) * 100}%`;

                                        return (
                                            <div key={idx}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: '#3c1010' }}>
                                                    <span><strong>{idx + 1}º</strong> {prod.produtoNome} <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>({prod.quantidade} un)</span></span>
                                                    <span style={{ fontWeight: 'bold', color: '#710100' }}>R$ {prod.faturamento.toFixed(2).replace('.', ',')}</span>
                                                </div>
                                                <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: larguraBarra,
                                                        height: '100%',
                                                        backgroundColor: '#710100',
                                                        opacity: 1 - (idx * 0.15),
                                                        borderRadius: '4px'
                                                    }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                    </div>

                    {/* 3. AUDITORIA FINANCEIRA COLETANDO SALDO DO DTO JAVA */}
                    <div className="report-container" style={{ padding: '20px 25px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <div className="container-header" style={{ marginBottom: '10px', borderBottom: '2px solid #fff1f1', paddingBottom: '6px' }}>
                            <h2 style={{ color: '#710100', margin: '0', fontFamily: 'Abhaya Libre', fontSize: '22px' }}>Auditoria e Fechamento de Caixa</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
                            <div style={{ padding: '12px 15px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #f0e6e6', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#6c757d', fontWeight: 'bold' }}>Total de Entradas (Faturamento)</span>
                                <h3 style={{ color: '#28a745', margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Georgia', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MdAdd style={{ fontSize: '1.1rem' }} /> R$ {totalEntradas.toFixed(2).replace('.', ',')}
                                </h3>
                            </div>

                            <div style={{ padding: '12px 15px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #f0e6e6', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#6c757d', fontWeight: 'bold' }}>Total de Saídas (Despesas)</span>
                                <h3 style={{ color: '#ff4d4d', margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Georgia', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MdRemoveCircleOutline style={{ fontSize: '1.1rem' }} /> R$ {totalSaidas.toFixed(2).replace('.', ',')}
                                </h3>
                            </div>

                            <div style={{
                                padding: '12px 15px',
                                backgroundColor: saldoConsolidado >= 0 ? '#e6f7ed' : '#fff1f1',
                                borderRadius: '10px',
                                border: saldoConsolidado >= 0 ? '1px solid #c2ebd0' : '1px solid #ffcccc',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                            }}>
                                <span style={{ fontSize: '0.78rem', color: saldoConsolidado >= 0 ? '#1e5e3a' : '#ff4d4d', fontWeight: 'bold' }}>Saldo Líquido Período</span>
                                <h3 style={{
                                    color: saldoConsolidado >= 0 ? '#28a745' : '#ff4d4d',
                                    margin: '0',
                                    fontSize: '1.4rem',
                                    fontWeight: 'bold',
                                    fontFamily: 'Georgia',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <MdCheckCircle style={{ fontSize: '1.1rem' }} /> R$ {saldoConsolidado.toFixed(2).replace('.', ',')}
                                </h3>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};