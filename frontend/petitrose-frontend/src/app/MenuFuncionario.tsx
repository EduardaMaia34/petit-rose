import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { PedidoCard } from './PedidoCard'; // 🔥 Importação do seu componente de card oficial
import { api } from './api';
import Swal from 'sweetalert2';
import '../index.css';
import { MdInventory, MdSchedule } from 'react-icons/md';

interface ItemEstoqueDTO {
    id: string;
    nomeInsumo: string;
    quantidadeAtual: number;
    porcentagem: number;
    status: string;
}

export const MenuFuncionario = () => {
    const navigate = useNavigate();
    const [estoque, setEstoque] = useState<ItemEstoqueDTO[]>([]);
    const [pedidosPendentes, setPedidosPendentes] = useState<any[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    const buscarDadosOperacionais = async () => {
        try {
            setCarregando(true);

            // Realiza as chamadas ao backend de forma simultânea
            const [resEstoque, resPedidos] = await Promise.all([
                api.get('/estoque'),
                api.get('/pedidos')
            ]);

            setEstoque(resEstoque.data);

            // Filtra os pedidos exibindo apenas o que a cozinha precisa produzir (PENDENTE ou PREPARANDO)
            const filaCozinha = resPedidos.data.filter((p: any) =>
                p.status === 'PENDENTE' || p.status === 'PREPARANDO'
            );
            setPedidosPendentes(filaCozinha);

        } catch (error) {
            console.error("Erro ao carregar painel do funcionário:", error);
            Swal.fire({
                title: 'Erro de Comunicação',
                text: 'Não foi possível sincronizar a cozinha e o estoque com o servidor.',
                icon: 'error',
                confirmButtonColor: '#710100'
            });
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarDadosOperacionais();
    }, []);

    // Função de ação reativa ao alterar o status direto do card
    const handleAlterarStatusCard = async (id: string, pedidoOriginal: any, novoStatusTexto: string) => {
        try {
            await api.put(`/pedidos/${id}/status?status=${novoStatusTexto}`);

            // Recarrega os dados locais para atualizar a fila de produção instantaneamente
            await buscarDadosOperacionais();

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Pedido atualizado para ${novoStatusTexto}!`,
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            Swal.fire('Erro', 'Não foi possível atualizar o status do pedido.', 'error');
        }
    };

    // Função de ação ao clicar em cancelar no card
    const handleDeletarPedidoCard = async (id: string) => {
        const result = await Swal.fire({
            title: 'Cancelar Pedido?',
            text: "Esta ação não poderá ser revertida.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#600000',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, cancelar!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/pedidos/${id}`);
                await buscarDadosOperacionais();
                Swal.fire('Cancelado!', 'O pedido foi cancelado com sucesso.', 'success');
            } catch (error) {
                console.error("Erro ao deletar:", error);
                Swal.fire('Erro', 'Não foi possível cancelar o pedido.', 'error');
            }
        }
    };

    // Identifica insumos com níveis críticos (30% ou menos) conforme a lógica do seu ControleEstoque.tsx
    const insumosCriticos = estoque.filter(item => item.porcentagem <= 30 || item.status === 'CRITICO');

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="inicio" />

            <div className="main-container">
                <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>

                    {/* Cabeçalho Operacional */}
                    <div style={{ marginBottom: '25px' }}>
                        <h2 style={{  color: '#710100', margin: '0 0 5px 0', fontSize: '32px', fontWeight: 'bold' }}>
                            Painel Operacional
                        </h2>
                        <p style={{ color: '#6c757d', margin: '0' }}>Acompanhe os pedidos ativos em tempo real e verifique as matérias-primas antes de registrar novos consumos.</p>
                    </div>

                    {carregando ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#710100', fontWeight: 'bold' }}>
                            Sincronizando painel Petit Rose...
                        </div>
                    ) : (
                        /* GRID DIVIDIDO EM DUAS COLUNAS ASYMMETRICAS */
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px', alignItems: 'start' }}>

                            {/* COLUNA ESQUERDA: FILA DE PRODUÇÃO UTILIZANDO O PEDIDOCARD */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <MdSchedule style={{ fontSize: '1.5rem', color: '#710100' }} />
                                    <h2 style={{ fontSize: '1.25rem', color: '#710100', margin: '0', fontFamily: 'Abhaya Libre, serif', fontWeight: 'bold' }}>
                                        Fila de Produção Ativa ({pedidosPendentes.length})
                                    </h2>
                                </div>

                                {pedidosPendentes.length === 0 ? (
                                    <div className="report-container" style={{ padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                                         Nenhum pedido pendente ou em preparo no momento.
                                    </div>
                                ) : (
                                    /* Grid interno de cartões igual ao da tela de pedidos */
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                                        {pedidosPendentes.map((pedido) => (
                                            <PedidoCard
                                                key={pedido.id}
                                                pedido={pedido}
                                                onAlterarStatus={handleAlterarStatusCard}
                                                onDeletarPedido={handleDeletarPedidoCard}
                                                onEditarClick={(p) => navigate('/pedidos')} // Redireciona para gerenciar a edição completa na tela de pedidos
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* COLUNA DIREITA: ALERTAS VISUAIS DE FALTA DE INSUMOS */}
                            <div className="report-container" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', minHeight: '400px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MdInventory style={{ fontSize: '1.5rem', color: '#710100' }} />
                                        <h2 style={{ fontSize: '1.25rem', color: '#710100', margin: '0', fontFamily: 'Abhaya Libre, serif', fontWeight: 'bold' }}>
                                            Insumos Críticos
                                        </h2>
                                    </div>
                                    <div style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: insumosCriticos.length > 0 ? '#fff1f1' : '#e6f7ed', fontSize: '0.75rem', fontWeight: 'bold', color: insumosCriticos.length > 0 ? '#ff4d4d' : '#28a745' }}>
                                        {insumosCriticos.length > 0 ? '⚠ REPOSIÇÃO' : ' ESTOQUE SEGURO'}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {insumosCriticos.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '60px 10px', color: '#28a745', fontWeight: '500', fontSize: '0.9rem' }}>
                                            🌿 Todos os ingredientes estão com níveis adequados! Pronto para produzir qualquer receita do catálogo.
                                        </div>
                                    ) : (
                                        insumosCriticos.map((item) => {
                                            const corBarra = item.porcentagem <= 15 ? '#ff4d4d' : '#ff9900';
                                            return (
                                                <div key={item.id} style={{ padding: '12px', border: '1px solid #f8eeee', borderRadius: '8px', backgroundColor: '#fffcfc' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                        <strong style={{ color: '#3c1010', fontSize: '0.9rem' }}>{item.nomeInsumo}</strong>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: corBarra }}>
                                                            {item.quantidadeAtual} un ({item.porcentagem}%)
                                                        </span>
                                                    </div>

                                                    {/* Barra de Progresso em CSS */}
                                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f0e6e6', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${item.porcentagem}%`, height: '100%', backgroundColor: corBarra, borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                                                    </div>
                                                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#ff4d4d', fontWeight: '500' }}>
                                                        {item.quantidadeAtual <= 0 ? '❌ Esgotado! Não venda itens com este produto.' : '⚠️ Quantidade reduzida no estoque.'}
                                                    </p>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};