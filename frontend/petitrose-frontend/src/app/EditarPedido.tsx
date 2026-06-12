import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from './api';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import '../index.css';

export const EditarPedido = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [pedidoOriginal, setPedidoOriginal] = useState<any>(null);
    const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
    const [itensEditados, setItensEditados] = useState<any[]>([]);

    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidadeNova, setQuantidadeNova] = useState(1);
    const [observacaoNova, setObservacaoNova] = useState('');

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const [resProd, resPedido] = await Promise.all([
                    api.get('/produtos'),
                    api.get(`/api/pedidos`) // Filtra localmente o ID correto
                ]);

                setProdutosDisponiveis(resProd.data);
                const pedidoAlvo = resPedido.data.find((p: any) => p.id === id);

                if (pedidoAlvo) {
                    setPedidoOriginal(pedidoAlvo);
                    // Mapeia para controle interno da tabela de edição
                    setItensEditados(pedidoAlvo.itens.map((i: any) => ({
                        idItem: i.id,
                        idProduto: i.produto.id,
                        nome: i.produto.nome,
                        quantidade: i.quantidade,
                        precoUnitario: i.precoUnitario,
                        observacao: i.observacao || ''
                    })));
                }
            } catch (error) {
                Swal.fire('Erro', 'Não foi possível resgatar as informações do pedido.', 'error');
            }
        };
        buscarDados();
    }, [id]);

    const adicionarItemEdicao = () => {
        const doce = produtosDisponiveis.find(p => p.id === produtoSelecionado);
        if (!doce) return;

        const jaExiste = itensEditados.find(i => i.idProduto === doce.id);
        if (jaExiste) {
            setItensEditados(itensEditados.map(i =>
                i.idProduto === doce.id ? { ...i, quantidade: i.quantidade + quantidadeNova } : i
            ));
        } else {
            setItensEditados([...itensEditados, {
                idItem: null, // Novo item adicionado
                idProduto: doce.id,
                nome: doce.nome,
                quantidade: quantidadeNova,
                precoUnitario: doce.valor,
                observacao: observacaoNova
            }]);
        }
        setQuantidadeNova(1);
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
            Swal.fire('Aviso', 'O pedido não pode ficar completamente vazio.', 'warning');
            return;
        }

        try {
            // Envia o payload no formato exato que a sua entidade Pedido.java aceita
            await api.put(`/api/pedidos/${id}`, {
                id: id,
                status: pedidoOriginal.status,
                valorTotal: calcularValorTotal(),
                cliente: pedidoOriginal.cliente,
                comanda: pedidoOriginal.comanda,
                itens: itensEditados.map(i => ({
                    id: i.idItem, // se for novo vai null e o JPA gera
                    precoUnitario: i.precoUnitario,
                    quantidade: i.quantidade,
                    observacao: i.observacao,
                    produto: { id: i.idProduto }
                }))
            });

            Swal.fire('Sucesso!', 'Pedido modificado e salvo com sucesso!', 'success').then(() => {
                navigate('/pedidos');
            });
        } catch (error) {
            Swal.fire('Erro', 'Ocorreu um erro ao atualizar os dados no banco.', 'error');
        }
    };

    if (!pedidoOriginal) return <p style={{ padding: '50px', textAlign: 'center' }}>Carregando dados do pedido...</p>;

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="pedidos" />
            <div className="main-container">
                <h2 style={{ fontFamily: 'Abhaya Libre, serif', color: '#600000' }}>
                    Modificar Pedido #{pedidoOriginal.id.substring(0, 5)}
                </h2>
                <p>Cliente associado: <strong>{pedidoOriginal.cliente?.nome}</strong></p>
                <p>Mesa atual da Comanda: <strong>{pedidoOriginal.comanda?.numeroMesa}</strong></p>

                <div className="form-produto-container" style={{ marginTop: '20px' }}>
                    <h3>Inserir novos doces</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr', gap: '15px', alignItems: 'end' }}>
                        <div className="form-group">
                            <label>Escolher Produto</label>
                            <select value={produtoSelecionado} onChange={(e) => setProdutoSelecionado(e.target.value)}>
                                <option value="">Selecione...</option>
                                {produtosDisponiveis.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input type="number" min="1" value={quantidadeNova} onChange={(e) => setQuantidadeNova(parseInt(e.target.value))} />
                        </div>
                        <div className="form-group">
                            <label>Observação (Opcional)</label>
                            <input type="text" placeholder="Ex: Sem canela" value={observacaoNova} onChange={(e) => setObsNova(e.target.value)} />
                        </div>
                        <button type="button" className="btn-padrao" style={{ height: '42px', marginBottom: 0 }} onClick={adicionarItemEdicao}>
                            + Incluir
                        </button>
                    </div>

                    <h3 style={{ marginTop: '30px' }}>Lista Atual de Itens</h3>
                    <div className="produtos-table-container">
                        <table className="produtos-table">
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Preço Unitário</th>
                                <th>Quantidade</th>
                                <th>Observações</th>
                                <th>Subtotal</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {itensEditados.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.nome}</td>
                                    <td>R$ {Number(item.precoUnitario).toFixed(2)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            style={{ width: '60px', padding: '4px' }}
                                            value={item.quantidade}
                                            onChange={(e) => alterarQuantidadeItem(idx, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td>{item.observacao || <span style={{ color: '#aaa' }}>Nenhuma</span>}</td>
                                    <td><strong>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</strong></td>
                                    <td>
                                        <button type="button" style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '18px' }} onClick={() => removerItemEdicao(idx)}>
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <h2>Total Corrigido: R$ {calcularValorTotal().toFixed(2)}</h2>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                        <button type="button" className="btn-padrao" style={{ backgroundColor: '#ccc', color: '#333' }} onClick={() => navigate('/pedidos')}>
                            Cancelar
                        </button>
                        <button type="button" className="btn-padrao" onClick={salvarAlteracoes}>
                            Confirmar e Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};