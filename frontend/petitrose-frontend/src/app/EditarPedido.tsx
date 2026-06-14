import React, { useEffect, useState } from 'react';
import { api } from './api';
import Swal from 'sweetalert2';
import { BiEdit,  BiTrash } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

interface EditarPedidoProps {
    idPedidoModal: string;
    onClose: () => void;
    onSucesso: () => void;
}

export const EditarPedido: React.FC<EditarPedidoProps> = ({ idPedidoModal, onClose, onSucesso }) => {
    const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
    const [itensEditados, setItensEditados] = useState<any[]>([]);
    const [pedidoOriginal, setPedidoOriginal] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);

    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidadeNova, setQuantidadeNova] = useState(1);
    const [observacaoNova, setObservacaoNova] = useState('');

    useEffect(() => {
        if (!idPedidoModal) return;

        const buscarDados = async () => {
            try {
                setCarregando(true);
                const [resProd, resPedido] = await Promise.all([
                    api.get('/produtos'),
                    api.get('/pedidos')
                ]);

                setProdutosDisponiveis(resProd.data);
                const pedidoAlvo = resPedido.data.find((p: any) => p.id === idPedidoModal);

                if (pedidoAlvo) {
                    setPedidoOriginal(pedidoAlvo);
                    if (pedidoAlvo.itens && Array.isArray(pedidoAlvo.itens)) {
                        setItensEditados(pedidoAlvo.itens.map((i: any) => ({
                            idItem: i.id,
                            idProduto: i.produto?.id,
                            nome: i.produto?.nome || 'Produto Indisponível',
                            quantidade: i.quantidade,
                            precoUnitario: i.precoUnitario,
                            observacao: i.observacao || ''
                        })));
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados", error);
                Swal.fire('Erro', 'Não foi possível resgatar as informações do pedido.', 'error');
            } finally {
                setCarregando(false);
            }
        };
        buscarDados();
    }, [idPedidoModal]);

    const adicionarItemEdicao = () => {
        if (!produtoSelecionado) return;
        const doce = produtosDisponiveis.find(p => p.id === produtoSelecionado);
        if (!doce) return;

        const jaExiste = itensEditados.find(i => i.idProduto === doce.id && i.observacao === observacaoNova);
        if (jaExiste) {
            setItensEditados(itensEditados.map(i =>
                (i.idProduto === doce.id && i.observacao === observacaoNova) ? { ...i, ...i, quantidade: i.quantidade + quantidadeNova } : i
            ));
        } else {
            setItensEditados([...itensEditados, {
                idItem: null,
                idProduto: doce.id,
                nome: doce.nome,
                quantidade: quantidadeNova,
                precoUnitario: doce.valor,
                observacao: observacaoNova
            }]);
        }
        setQuantidadeNova(1);
        setProdutoSelecionado('');
        setObservacaoNova('');
    };

    const removerItemEdicao = (index: number) => {
        setItensEditados(itensEditados.filter((_, i) => i !== index));
    };

    const alterarQuantidadeItem = (index: number, valor: number) => {
        if (valor < 1) return;
        setItensEditados(itensEditados.map((item, i) => i === index ? { ...item, quantidade: valor } : item));
    };

    const calcularValorTotal = () => {
        return itensEditados.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
    };

    const salvarAlteracoes = async () => {
        if (itensEditados.length === 0) {
            Swal.fire('Aviso', 'O pedido não pode ficar vazio.', 'warning');
            return;
        }

        try {
            await api.put(`/pedidos/${idPedidoModal}`, {
                id: idPedidoModal,
                status: pedidoOriginal.status,
                valorTotal: calcularValorTotal(),
                comanda: pedidoOriginal.comanda,
                itens: itensEditados.map(i => ({
                    id: i.idItem,
                    precoUnitario: i.precoUnitario,
                    quantidade: i.quantidade,
                    observacao: i.observacao,
                    produto: { id: i.idProduto }
                }))
            });

            Swal.fire('Sucesso!', 'Pedido atualizado com sucesso!', 'success');
            onSucesso();
        } catch (error) {
            Swal.fire('Erro', 'Ocorreu um erro ao atualizar os dados no banco.', 'error');
        }
    };

    if (carregando) return null;

    return (
        <div className="modal-backdrop" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(113, 1, 0, 0.25)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div className="modal-content-wrapper" style={{
                backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px',
                maxWidth: '750px', width: '92%', maxHeight: '90vh', overflowY: 'auto',
                fontFamily: "'Georgia', serif", color: '#600000',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)', position: 'relative'
            }}>

                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', color: '#a0a0a0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <IoClose />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BiEdit size={22} color="#600000" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#710100' }}>Alterar Itens do Pedido</h3>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#555', fontFamily: 'sans-serif' }}>Altere os itens da comanda vinculada.</p>

                <div style={{ backgroundColor: '#fffaf0', padding: '15px', borderRadius: '12px', border: '1px solid #fbbfc5', marginBottom: '20px', fontFamily: 'sans-serif', fontSize: '14px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontFamily: "'Georgia', serif" }}>Inserir novos doces</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: '10px', alignItems: 'end' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Doce / Item</label>
                            <select value={produtoSelecionado} onChange={(e) => setProdutoSelecionado(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fbbfc5', backgroundColor: '#fff' }}>
                                <option value="">Selecione um doce...</option>
                                {produtosDisponiveis.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome} - R$ {Number(p.valor).toFixed(2)}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Qtd.</label>
                            <input type="number" min="1" value={quantidadeNova} onChange={(e) => setQuantidadeNova(parseInt(e.target.value) || 1)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fbbfc5' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Obs.</label>
                            <input type="text" placeholder="Observação" value={observacaoNova} onChange={(e) => setObservacaoNova(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fbbfc5' }} />
                        </div>
                        <button type="button" onClick={adicionarItemEdicao} style={{ backgroundColor: '#710100', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            + Incluir
                        </button>
                    </div>
                </div>

                <div style={{ border: '1px solid #fbbfc5', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', fontFamily: 'sans-serif', fontSize: '14px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#fff5f5', color: '#600000' }}>
                        <tr>
                            <th style={{ padding: '12px' }}>Doce</th>
                            <th style={{ padding: '12px' }}>Preço</th>
                            <th style={{ padding: '12px', width: '90px' }}>Qtd</th>
                            <th style={{ padding: '12px' }}>Subtotal</th>
                            <th style={{ padding: '12px', textAlign: 'center', width: '60px' }}>Excluir</th>
                        </tr>
                        </thead>
                        <tbody>
                        {itensEditados.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #fff5f5' }}>
                                <td style={{ padding: '12px' }}>
                                    <strong>{item.nome}</strong>
                                    {item.observacao && <span style={{ display: 'block', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>({item.observacao})</span>}
                                </td>
                                <td style={{ padding: '12px' }}>R$ {Number(item.precoUnitario).toFixed(2)}</td>
                                <td style={{ padding: '12px' }}>
                                    <input type="number" min="1" value={item.quantidade} onChange={(e) => alterarQuantidadeItem(idx, parseInt(e.target.value) || 1)} style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </td>
                                <td style={{ padding: '12px' }}><strong>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</strong></td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button type="button" onClick={() => removerItemEdicao(idx)} style={{ background: 'none', border: 'none', color: '#c93b3b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                        <BiTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #fbbfc5', paddingTop: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Total Corrigido:</h3>
                    <strong style={{ fontSize: '24px', color: '#710100' }}>R$ {calcularValorTotal().toFixed(2)}</strong>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={onClose} style={{ backgroundColor: '#ffffff', color: '#555555', border: '1px solid #dcdcdc', borderRadius: '10px', padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Voltar
                    </button>
                    <button type="button" onClick={salvarAlteracoes} style={{ backgroundColor: '#600000', color: '#fff8e6', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};