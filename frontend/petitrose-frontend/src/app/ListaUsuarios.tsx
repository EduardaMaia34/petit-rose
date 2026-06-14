import { useEffect, useState } from 'react';
import { api } from './api';
import { Navbar } from './Navbar';
import { ModalCadastrarUsuario } from './ModalCadastrarUsuario';
import { ModalEditarUsuario } from './ModalEditarUsuario';
import { BiEdit, BiTrash } from 'react-icons/bi';
import Swal from 'sweetalert2';
import '../index.css';

interface UsuarioData {
    id: string;
    nome: string;
    user: string;
    gerente: boolean;
}

export const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
    const [carregando, setCarregando] = useState(true);

    // Estados de visibilidade dos modais que chamam os componentes externos
    const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
    const [isModalEdicaoAberto, setIsModalEdicaoAberto] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioData | null>(null);

    // Validação estrita baseada no localStorage
    const usuarioLogado = localStorage.getItem('usuario_login') || localStorage.getItem('user') || '';
    const eAdminMestre = usuarioLogado.toLowerCase() === 'admin';

    const carregarUsuarios = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/usuarios'); // @GetMapping do seu UsuarioController.java
            if (Array.isArray(response.data)) {
                setUsuarios(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
            Swal.fire('Erro', 'Não foi possível carregar a lista de colaboradores.', 'error');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const abrirCadastro = () => {
        if (!eAdminMestre) {
            Swal.fire('Acesso Negado', 'Permissão restrita ao administrador.', 'warning');
            return;
        }
        setIsModalCadastroAberto(true);
    };

    const abrirEdicao = (u: UsuarioData) => {
        if (!eAdminMestre) {
            Swal.fire('Acesso Negado', 'Permissão restrita ao administrador.', 'warning');
            return;
        }
        setUsuarioSelecionado(u);
        setIsModalEdicaoAberto(true);
    };

    const deletarUsuario = async (id: string, nomeUser: string) => {
        if (nomeUser === 'admin') {
            Swal.fire('Bloqueado', 'A conta mestre do sistema não pode ser removida.', 'error');
            return;
        }

        const result = await Swal.fire({
            title: `Excluir conta de ${nomeUser}?`,
            text: "Esta ação revogará os acessos do funcionário permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#600000',
            cancelButtonColor: '#fbbfc5',
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Manter'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/usuarios/${id}`); // @DeleteMapping do seu UsuarioController.java
                Swal.fire('Deletado!', 'Usuário removido com sucesso.', 'success');
                carregarUsuarios();
            } catch (error) {
                Swal.fire('Erro', 'Não foi possível completar a exclusão.', 'error');
            }
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar abaAtiva="usuarios" />
            <div className="main-container">
                <div className="container-header">
                    <div>
                        <h2>Colaboradores e Usuários</h2>
                        <p>Gerencie o acesso dos atendentes e gerentes da Petit Rose.</p>
                    </div>
                    {eAdminMestre && (
                        <button className="btn-novo" onClick={abrirCadastro}>
                            + Cadastrar Usuário
                        </button>
                    )}
                </div>

                {carregando ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#600000' }}>Carregando dados...</p>
                ) : (
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #fbbfc5' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: "'Georgia', serif" }}>
                            <thead style={{ backgroundColor: '#fcb1b0', color: '#600000' }}>
                            <tr>
                                <th style={{ padding: '15px 20px' }}>Nome Completo</th>
                                <th style={{ padding: '15px 20px' }}>Login (Username)</th>
                                <th style={{ padding: '15px 20px' }}>Nível de Acesso</th>
                                {eAdminMestre && <th style={{ padding: '15px 20px', textAlign: 'center', width: '200px' }}>Ações</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #ffd7c9', color: '#600000' }}>
                                    <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{u.nome}</td>
                                    <td style={{ padding: '15px 20px' }}>{u.user}</td>
                                    <td style={{ padding: '15px 20px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                                backgroundColor: u.gerente ? '#fbbfc5' : '#e2e3e5',
                                                color: u.gerente ? '#600000' : '#383d41'
                                            }}>
                                                {u.gerente ? 'Admin' : ' Atendente'}
                                            </span>
                                    </td>
                                    {eAdminMestre && (
                                        <td style={{ padding: '15px 20px', display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                                            <button
                                                onClick={() => abrirEdicao(u)}
                                                style={{
                                                    backgroundColor: '#fbbfc5',
                                                    color: '#600000',
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 0,
                                                    transition: '0.2s'
                                                }}
                                                title="Editar Colaborador"
                                            >
                                                <BiEdit size={20} />
                                            </button>
                                            <button
                                                onClick={() => deletarUsuario(u.id, u.user)}
                                                style={{
                                                    backgroundColor: '#600000',
                                                    color: '#fff8e6',
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 0,
                                                    transition: '0.2s'
                                                }}
                                                title="Excluir Colaborador"
                                            >
                                                <BiTrash size={20} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 🔥 RENDERIZAÇÃO DOS MODAIS ISOLADOS */}
            {isModalCadastroAberto && (
                <ModalCadastrarUsuario
                    onClose={() => setIsModalCadastroAberto(false)}
                    onSucesso={() => { setIsModalCadastroAberto(false); carregarUsuarios(); }}
                />
            )}

            {isModalEdicaoAberto && usuarioSelecionado && (
                <ModalEditarUsuario
                    usuario={usuarioSelecionado}
                    onClose={() => { setIsModalEdicaoAberto(false); setUsuarioSelecionado(null); }}
                    onSucesso={() => { setIsModalEdicaoAberto(false); setUsuarioSelecionado(null); carregarUsuarios(); }}
                />
            )}
        </div>
    );
};