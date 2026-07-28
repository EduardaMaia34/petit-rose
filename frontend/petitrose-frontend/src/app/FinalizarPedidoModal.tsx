import { api } from './api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const FinalizarPedidoModal = ({ dados, onClose }: any) => {
    const navigate = useNavigate();

    const confirmarPedido = async () => {
        try {
            await api.post(`/pedidos/comanda/${dados.comandaId}`, {
                comandaId: dados.comandaId,
                itens: dados.itens.map((i: any) => ({
                    produtoId: i.id,
                    quantidade: i.quantidade,
                    observacao: i.observacao || ""
                }))
            });

            Swal.fire({
                title: 'Sucesso!',
                text: 'Pedido Petit Rose registrado na comanda com sucesso!',
                icon: 'success',
                confirmButtonColor: '#600000'
            }).then(() => {
                // 🔥 Redireciona de volta para a tela cheia de listagem atualizada
                navigate('/pedidos');
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Não foi possível associar o pedido à comanda no banco.', 'error');
        }
    };

    return (
        <div className="swal2-container swal2-backdrop-show" style={{
            display: 'flex', position: 'fixed', zIndex: 9999,
            top: 0, left: 0, width: '100vw', height: '100vh',
            backdropFilter: 'blur(4px)', // 🔥 Apenas o blur limpo conforme solicitado
            backgroundColor: 'rgba(0, 0, 0, 0.2)', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="swal2-popup swal2-modal swal2-show" style={{
                display: 'grid', backgroundColor: '#fff8e6', fontFamily: "'Georgia', serif",
                color: '#600000', padding: '25px', borderRadius: '15px', border: '2px solid #fbbfc5',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxWidth: '430px', width: '90%'
            }}>
                <div className="swal2-header">
                    <h2 className="swal2-title" style={{ color: '#710100', margin: '0 0 10px 0', fontSize: '22px' }}>Confirmar Envio?</h2>
                </div>
                <div className="swal2-content" style={{ textAlign: 'left', fontFamily: 'sans-serif', fontSize: '14px' }}>
                    <p>O pedido será enviado diretamente para a fila de produção da cozinha.</p>
                    <h3 style={{ fontSize: '15px', color: '#600000', margin: '15px 0 5px 0', borderTop: '1px solid #fbbfc5', paddingTop: '10px' }}>Resumo:</h3>
                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                        {dados.itens.map((item: any, index: number) => (
                            <li key={index} style={{ marginBottom: '4px' }}>
                                <strong>{item.quantidade}x</strong> {item.nome}
                            </li>
                        ))}
                    </ul>
                    <p style={{ fontSize: '18px', marginTop: '15px', borderTop: '1px dashed #fcb1b0', paddingTop: '10px' }}>
                        Valor Total: <strong style={{ color: '#710100' }}>R$ {dados.total.toFixed(2)}</strong>
                    </p>
                </div>
                <div className="swal2-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="button" className="swal2-cancel swal2-styled" onClick={onClose} style={{ cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', backgroundColor: '#fcb1b0', color: '#710100', fontWeight: 'bold', border: 'none' }}>
                        Voltar
                    </button>
                    <button type="button" className="swal2-confirm swal2-styled" onClick={confirmarPedido} style={{ cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', backgroundColor: '#600000', color: '#fff8e6', fontWeight: 'bold', border: 'none' }}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};