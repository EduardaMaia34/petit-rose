
import { api } from './api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const FinalizarPedidoModal = ({ dados, onClose }: any) => {
    const navigate = useNavigate();

    const confirmarPedido = async () => {
        try {
            await api.post(`/api/pedidos/comanda/${dados.comandaId}`, {
                valorTotal: dados.total,
                status: "PENDENTE",
                itens: dados.itens.map((i: any) => ({
                    produto: { id: i.id },
                    quantidade: i.quantidade,
                    precoUnitario: i.preco
                }))
            });

            Swal.fire({
                title: 'Sucesso!',
                text: 'Pedido Petit Rose registrado na comanda com sucesso!',
                icon: 'success',
                confirmButtonColor: '#600000'
            }).then(() => {
                navigate('/pedidos');
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Não foi possível associar o pedido à comanda no banco.', 'error');
        }
    };

    return (
        <div className="swal2-container swal2-backdrop-show" style={{ display: 'flex', position: 'fixed', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <div className="swal2-popup swal2-modal" style={{ display: 'block', width: '450px', padding: '30px', background: '#fffaf0' }}>
                <h2 className="swal2-title" style={{ fontSize: '24px', marginBottom: '20px' }}>Confirmar Envio</h2>
                <div className="swal2-content" style={{ textAlign: 'left', color: '#600000', fontSize: '16px' }}>
                    <p><strong>Comanda Vinculada:</strong> #{dados.comandaId.substring(0,8)}...</p>
                    <p><strong>Total de Itens:</strong> {dados.itens.length} tipo(s)</p>

                    <h3 style={{ marginTop: '15px', fontSize: '16px', borderTop: '1px solid #fbbfc5', paddingTop: '10px' }}>Resumo:</h3>
                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                        {dados.itens.map((item: any, index: number) => (
                            <li key={index}>{item.quantidade}x {item.nome}</li>
                        ))}
                    </ul>

                    <p style={{ fontSize: '20px', marginTop: '15px', borderTop: '1px dashed #fcb1b0', paddingTop: '10px' }}>
                        Valor a ser lançado: <strong style={{ color: '#710100' }}>R$ {dados.total.toFixed(2)}</strong>
                    </p>
                </div>
                <div className="swal2-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                    <button type="button" className="swal2-cancel swal2-styled" onClick={onClose} style={{ cursor: 'pointer', padding: '10px 20px', borderRadius: '10px' }}>
                        Voltar e Ajustar
                    </button>
                    <button type="button" className="swal2-confirm swal2-styled" onClick={confirmarPedido} style={{ cursor: 'pointer', padding: '10px 20px', borderRadius: '10px' }}>
                        Confirmar Lançamento
                    </button>
                </div>
            </div>
        </div>
    );
};