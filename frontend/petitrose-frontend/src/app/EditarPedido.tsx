import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from './api';
import Swal from 'sweetalert2';
import '../index.css';

interface EditarPedidoProps {
    idPedidoModal?: string;
    onClose?: () => void;
}

export const EditarPedido: React.FC<EditarPedidoProps> = ({ idPedidoModal, onClose }) => {
    const { id: idUrl } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const id = idPedidoModal || idUrl;

    const [pedidoOriginal, setPedidoOriginal] = useState<any>(null);
    const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
    const [itensEditados, setItensEditados] = useState<any[]>([]);

    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidadeNova, setQuantidadeNova] = useState(1);
    const [observacaoNova, setObservacaoNova] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        if (!id) return;

        const buscarDados = async () => {
            try {
                setCarregando(true);
                // 🔥 URL corrigida para bater com o novo @RequestMapping("/pedidos") do backend
                const [resProd, resPedido] = await Promise.all([
                    api.get('/produtos'),
                    api.get(`/pedidos`)
                ]);

                setProdutosDisponiveis(resProd.data);
                const pedidoAlvo = resPedido.data.find((p: any) => p.id === id);

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
    }, [id]);

    const adicionarItemEdicao = () => {
        if (!produtoSelecionado) return;
        const doce = produtosDisponiveis.find(p => p.id === produtoSelecionado);
        if (!doce) return;

        const jaExiste = itensEditados.find(i => i.idProduto === doce.id);
        if (jaExiste) {
            setItensEditados(itensEditados.map(i =>
                i.idProduto === doce.id ? { ...i, quantidade: i.quantidade + quantidadeNova } : i
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

    const lidarComFechamento = () => {
        if (onClose) onClose();
        else navigate('/pedidos');
    };

    const salvarAlteracoes = async () => {
        if (itensEditados.length === 0) {
            Swal.fire('Aviso', 'O pedido não pode ficar vazio.', 'warning');
            return;
        }

        try {
            // 🔥 URL corrigida para o prefixo /pedidos
            await api.put(`/pedidos/${id}`, {
                id: id,
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
            lidarComFechamento();
        } catch (error) {
            Swal.fire('Erro', 'Ocorreu um erro ao atualizar os dados no banco.', 'error');
        }
    };

    if (carregando) return <p style={{ padding: '20px', textAlign: 'center', color: '#600000' }}>Carregando dados do pedido...</p>;
    if (!pedidoOriginal) return <p style={{ padding: '20px', textAlign: 'center' }}>Pedido não encontrado.</p>;

    return (
        <div style={{ fontFamily: "'Georgia', serif", color: '#600000' }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>Editar Pedido #{pedidoOriginal.id.substring(0, 5)}</h2>
                <p style={{ margin: '5px 0 20px 0', fontSize: '14px', color: '#8b0000' }}>
                    Altere os itens da mesa {pedidoOriginal.comanda?.numeroMesa || 'N/A'}
                </p>
            </div>

            <div style={{ backgroundColor: '#fffaf0', padding: '15px', borderRadius: '8px', border: '1px solid #fbbfc5', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Inserir novos doces</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', alignItems: 'end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '12px', marginBottom: '4px' }}>Doce / Item</label>
                        <select value={produtoSelecionado} onChange={(e) => setProdutoSelecionado(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="">Selecione um doce...</option>
                            {produtosDisponiveis.map(p => (
                                <option key={p.id} value={p.id}>{p.nome} - R$ {Number(p.valor).toFixed(2)}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '12px', marginBottom: '4px' }}>Qtd.</label>
                        <input type="number" min="1" value={quantidadeNova} onChange={(e) => setQuantidadeNova(parseInt(e.target.value))} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <button type="button" onClick={adicionarItemEdicao} style={{ height: '34px', backgroundColor: '#fbbfc5', color: '#600000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        + Incluir
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '200px', marginBottom: '20px', border: '1px solid #fbbfc5', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead style={{ backgroundColor: '#fcb1b0', color: '#710100' }}>
                    <tr>
                        <th style={{ padding: '8px' }}>Doce</th>
                        <th style={{ padding: '8px' }}>Preço</th>
                        <th style={{ padding: '8px', width: '70px' }}>Qtd</th>
                        <th style={{ padding: '8px' }}>Subtotal</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Excluir</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itensEditados.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px dashed #ffd7c9' }}>
                            <td style={{ padding: '8px' }}>{item.nome}</td>
                            <td style={{ padding: '8px' }}>R$ {Number(item.precoUnitario).toFixed(2)}</td>
                            <td style={{ padding: '8px' }}>
                                <input type="number" min="1" value={item.quantidade} onChange={(e) => alterarQuantidadeItem(idx, parseInt(e.target.value))} style={{ width: '50px', padding: '2px' }} />
                            </td>
                            <td style={{ padding: '8px' }}><strong>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</strong></td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                                <button type="button" onClick={() => removerItemEdicao(idx)} style={{ background: 'none', border: 'none', color: '#842020', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Total Corrigido: <span style={{ color: '#710100' }}>R$ {calcularValorTotal().toFixed(2)}</span></h3>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '1px dashed #fbbfc5', paddingTop: '15px' }}>
                <button type="button" onClick={lidarComFechamento} style={{ backgroundColor: '#600000', color: '#fff8e6', border: 'none', borderRadius: '4px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancelar
                </button>
                <button type="button" onClick={salvarAlteracoes} style={{ backgroundColor: '#fbbfc5', color: '#600000', border: 'none', borderRadius: '4px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Confirmar e Salvar
                </button>
            </div>
        </div>
    );
};