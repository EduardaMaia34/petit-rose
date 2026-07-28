import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { PedidoCard } from './PedidoCard'; // Seu componente oficial de cartões
import { api } from './api';
import Swal from 'sweetalert2';
import '../index.css';
import { MdTableRestaurant, MdSchedule, MdArrowForward } from 'react-icons/md';

interface MesaSalao {
    numeroMesa: number;
    aberta: boolean;
    valorTotalMesa: number;
}

export const MenuFuncionario = () => {
    const navigate = useNavigate();
    const [mesasOcupadas, setMesasOcupadas] = useState<MesaSalao[]>([]);
    const [pedidosPendentes, setPedidosPendentes] = useState<any[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    const buscarDadosOperacionais = async () => {
        try {
            setCarregando(true);

            // 🔥 ALTERADO: Usando o endpoint '/comandas/ativas' que já está liberado no Spring Security
            const [resComandas, resPedidos] = await Promise.all([
                api.get('/comandas/ativas'),
                api.get('/pedidos')
            ]);

            // Mapeia e agrupa as comandas do backend para consolidar o total por mesa localmente
            const comandasAtivas = resComandas.data;
            const mapaMesas: { [key: number]: number } = {};

            comandasAtivas.forEach((c: any) => {
                if (c.numeroMesa && c.numeroMesa !== 99) { // Ignora a comanda de balcão (99)
                    const valor = c.valorTotal || c.valorTotalComanda || c.total || 0;
                    mapaMesas[c.numeroMesa] = (mapaMesas[c.numeroMesa] || 0) + valor;
                }
            });

            // Transforma o objeto agrupado em uma lista ordenada para o painel de mesas ocupadas
            const listaMesasOcupadas: MesaSalao[] = Object.keys(mapaMesas).map(numMesa => ({
                numeroMesa: parseInt(numMesa),
                aberta: true,
                valorTotalMesa: mapaMesas[parseInt(numMesa)]
            })).sort((a, b) => a.numeroMesa - b.numeroMesa);

            setMesasOcupadas(listaMesasOcupadas);

            // Filtra os pedidos exibindo apenas o que a cozinha precisa produzir (PENDENTE ou PREPARANDO)
            const filaCozinha = resPedidos.data.filter((p: any) =>
                p.status === 'PENDENTE' || p.status === 'PREPARANDO'
            );
            setPedidosPendentes(filaCozinha);

        } catch (error) {
            console.error("Erro ao carregar painel do funcionário:", error);
            Swal.fire({
                title: 'Erro de Comunicação',
                text: 'Não foi possível sincronizar o salão e a cozinha com o servidor.',
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

    // Função reativa ao alterar o status do doce direto no PedidoCard
    const handleAlterarStatusCard = async (id: string, pedidoOriginal: any, novoStatusTexto: string) => {
        try {
            await api.put(`/pedidos/${id}/status?status=${novoStatusTexto}`);
            await buscarDadosOperacionais(); // Recarrega o painel instantaneamente

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

    // Função ao clicar em cancelar no PedidoCard
    const handleDeletarPedidoCard = async (id: string) => {
        const result = await Swal.fire({
            title: 'Cancelar Pedido?',
            text: "Esta ação removerá o prato da fila de produção.",
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
                Swal.fire('Cancelado!', 'O pedido foi removido.', 'success');
            } catch (error) {
                console.error("Erro ao deletar:", error);
                Swal.fire('Erro', 'Não foi possível cancelar o pedido.', 'error');
            }
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="inicio" />

            <div className="main-container">
                <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>

                    {/* Cabeçalho */}
                    <div style={{ marginBottom: '25px' }}>
                        <h2 style={{  color: '#710100', margin: '0 0 5px 0', fontSize: '32px', fontWeight: 'bold' }}>
                            Painel Operacional
                        </h2>
                        <p style={{ color: '#6c757d', margin: '0' }}>Acompanhe os pedidos ativos na cozinha e o consumo das mesas ativas no salão.</p>
                    </div>

                    {carregando ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#710100', fontWeight: 'bold' }}>
                            Sincronizando dados em tempo real...
                        </div>
                    ) : (
                        /* GRID OPERACIONAL: FILA DE PRODUÇÃO (ESQUERDA) vs MESAS OCUPADAS (DIREITA) */
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px', alignItems: 'start' }}>

                            {/* COLUNA ESQUERDA: PEDIDOCARD NA PRODUÇÃO */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #fff1f1', paddingBottom: '12px' }}>
                                    <MdSchedule style={{ fontSize: '1.5rem', color: '#710100' }} />
                                    <h2 style={{ fontSize: '1.25rem', color: '#710100', margin: '0', fontFamily: 'Abhaya Libre, serif', fontWeight: 'bold' }}>
                                        Fila de Production Cozinha ({pedidosPendentes.length})
                                    </h2>
                                </div>

                                {pedidosPendentes.length === 0 ? (
                                    <div className="report-container" style={{ padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                                         Nenhum doce pendente de preparo ou entrega.
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                                        {pedidosPendentes.map((pedido) => (
                                            <PedidoCard
                                                key={pedido.id}
                                                pedido={pedido}
                                                onAlterarStatus={handleAlterarStatusCard}
                                                onDeletarPedido={handleDeletarPedidoCard}
                                                onEditarClick={() => navigate('/pedidos')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* COLUNA DIREITA: MESAS OCUPADAS NO SALÃO */}
                            <div className="report-container" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f0e6e6', minHeight: '450px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fff1f1', paddingBottom: '12px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MdTableRestaurant style={{ fontSize: '1.5rem', color: '#710100' }} />
                                        <h2 style={{ fontSize: '1.25rem', color: '#710100', margin: '0', fontFamily: 'Abhaya Libre, serif', fontWeight: 'bold' }}>
                                            Mesas Ocupadas ({mesasOcupadas.length})
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => navigate('/gerenciamento-mesas')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#710100', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                                    >
                                        Ver Salão <MdArrowForward/>
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {mesasOcupadas.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '60px 10px', color: '#6c757d', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                             O salão está vazio no momento. Nenhuma mesa ocupada.
                                        </div>
                                    ) : (
                                        mesasOcupadas.map((mesa) => (
                                            <div
                                                key={mesa.numeroMesa}
                                                onClick={() => navigate('/gerenciamento-mesas')}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '14px 18px',
                                                    border: '1px solid #fcf0f0',
                                                    borderRadius: '10px',
                                                    backgroundColor: '#fffdfd',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(113,1,0,0.05)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#710100',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '14px'
                                                    }}>
                                                        {mesa.numeroMesa}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: '600', color: '#3c1010', fontSize: '0.95rem' }}>
                                                            Mesa {mesa.numeroMesa}
                                                        </span>
                                                        <div style={{ fontSize: '11px', color: '#28a745', fontWeight: '500' }}>
                                                            ● Em atendimento
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '11px', color: '#888', display: 'block' }}>Consumo</span>
                                                    <strong style={{ color: '#710100', fontSize: '1rem', fontFamily: 'Georgia, serif' }}>
                                                        R$ {mesa.valorTotalMesa.toFixed(2).replace('.', ',')}
                                                    </strong>
                                                </div>
                                            </div>
                                        ))
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