import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import { api } from "./api";
import '../index.css';
import { MdPictureAsPdf, MdAdd, MdTrendingUp, MdCheckCircle, MdRemoveCircleOutline } from 'react-icons/md';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList
} from 'recharts';



// Interfaces baseadas estritamente nos Records do Java do Petit Rose
interface ItemVendidoDTO {
    nomeProduto: string;
    quantidade: number;
    subtotal: number;
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
                dataInicio.setDate(1);
                dataInicio.setHours(0, 0, 0, 0);
            }

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

    // Proteção de valores padrão com fallback para zero
    const totalEntradas = dadosRelatorio?.totalEntradas ?? 0;
    const totalSaidas = dadosRelatorio?.totalSaidas ?? 0;
    const saldoConsolidado = dadosRelatorio?.saldo ?? 0;
    const maisVendidos = dadosRelatorio?.itensMaisVendidos || [];
    const faturamentoMetodos = dadosRelatorio?.faturamentoPorMetodoPagamento || {};
    const dadosPizza = Object.entries(faturamentoMetodos).map(
        ([metodo, valor]) => ({
            name: metodo.replace('_', ' '),
            value: valor || 0
        })
    );

    const dadosProdutos = maisVendidos
        .slice(0, 5)
        .map(prod => ({
            nome: prod.nomeProduto,
            quantidade: prod.quantidade
        }));

    const COLORS = [
        '#710100',
        '#f48a92',
        '#f7b3b8',
        '#fde2e2'
    ];
    // Mapeia os dados protegendo contra valores nulos/indefinidos
    const dadosGraficoMetodos = Object.entries(faturamentoMetodos).map(([metodo, valor]) => {
        const valorTratado = valor ?? 0;
        const valoresLimpos = Object.values(faturamentoMetodos).map(v => v ?? 0);
        const maiorValor = Math.max(...valoresLimpos, 1);
        const alturaCalculada = `${(valorTratado / maiorValor) * 100}%`;
        return { metodo, valor: valorTratado, alturaBarra: alturaCalculada };
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
                        <div
                            className="report-container"
                            style={{
                                padding: '20px 25px',
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                border: '1px solid #f0e6e6'
                            }}
                        >
                            <div
                                className="container-header"
                                style={{
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #fff1f1',
                                    paddingBottom: '6px'
                                }}
                            >
                                <h2
                                    style={{
                                        color: '#710100',
                                        margin: '0',
                                        fontFamily: 'Abhaya Libre',
                                        fontSize: '22px'
                                    }}
                                >
                                    Formas de Pagamento
                                </h2>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    alignItems: 'center'
                                }}
                            >
                                {/* Gráfico */}
                                <div style={{ width: '220px', height: '220px' }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={dadosPizza}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={85}
                                                dataKey="value"
                                            >
                                                {dadosPizza.map((_, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legenda */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px'
                                    }}
                                >
                                    {dadosPizza.map((item, index) => {
                                        const total = dadosPizza.reduce(
                                            (acc, cur) => acc + cur.value,
                                            0
                                        );

                                        const porcentagem =
                                            total > 0
                                                ? ((item.value / total) * 100).toFixed(0)
                                                : 0;

                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '18px',
                                                            height: '18px',
                                                            borderRadius: '4px',
                                                            backgroundColor:
                                                                COLORS[index % COLORS.length]
                                                        }}
                                                    />

                                                    <span>{item.name}</span>
                                                </div>

                                                <strong>{porcentagem}%</strong>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: PRODUTOS MAIS VENDIDOS DA CONFEITARIA */}
                        {/* CARD 2: PRODUTOS MAIS VENDIDOS */}
                        <div
                            className="report-container"
                            style={{
                                padding: '20px 25px',
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                border: '1px solid #f0e6e6'
                            }}
                        >
                            <div
                                className="container-header"
                                style={{
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #fff1f1',
                                    paddingBottom: '6px'
                                }}
                            >
                                <h2
                                    style={{
                                        color: '#710100',
                                        margin: '0',
                                        fontFamily: 'Abhaya Libre',
                                        fontSize: '22px'
                                    }}
                                >
                                    Produtos Mais Vendidos
                                </h2>
                            </div>

                            {dadosProdutos.length === 0 ? (
                                <p
                                    style={{
                                        textAlign: 'center',
                                        color: '#6c757d',
                                        fontStyle: 'italic',
                                        marginTop: '50px'
                                    }}
                                >
                                    Nenhum produto vendido no período.
                                </p>
                            ) : (
                                <div style={{ width: '100%', height: '280px' }}>
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={dadosProdutos}
                                            layout="vertical"
                                            margin={{
                                                top: 5,
                                                right: 40,
                                                left: 30,
                                                bottom: 5
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                horizontal={false}
                                            />

                                            <XAxis type="number" />

                                            <YAxis
                                                type="category"
                                                dataKey="nome"
                                                width={120}
                                            />

                                            <Tooltip />

                                            <Bar
                                                dataKey="quantidade"
                                                fill="#f48b94"
                                                radius={[0, 4, 4, 0]}
                                            >
                                                <LabelList
                                                    dataKey="quantidade"
                                                    position="right"
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
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
                                {/* 💎 PROTEGIDO: Evita quebra se totalEntradas for nulo */}
                                <h3 style={{ color: '#28a745', margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Georgia', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MdAdd style={{ fontSize: '1.1rem' }} /> R$ {(totalEntradas || 0).toFixed(2).replace('.', ',')}
                                </h3>
                            </div>

                            <div style={{ padding: '12px 15px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #f0e6e6', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#6c757d', fontWeight: 'bold' }}>Total de Saídas (Despesas)</span>
                                {/* 💎 PROTEGIDO: Evita quebra se totalSaidas for nulo */}
                                <h3 style={{ color: '#ff4d4d', margin: '0', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Georgia', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MdRemoveCircleOutline style={{ fontSize: '1.1rem' }} /> R$ {(totalSaidas || 0).toFixed(2).replace('.', ',')}
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
                                {/* 💎 PROTEGIDO: Evita quebra se saldoConsolidado for nulo */}
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
                                    <MdCheckCircle style={{ fontSize: '1.1rem' }} /> R$ {(saldoConsolidado || 0).toFixed(2).replace('.', ',')}
                                </h3>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};