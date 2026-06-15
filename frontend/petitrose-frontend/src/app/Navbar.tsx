import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logoBarraPetitRose from '../assets/LogoBarra.png';
import { BiChevronDown } from 'react-icons/bi';

interface NavbarProps {
    // Adicionado 'estoque' como uma aba ativa válida do sistema
    abaAtiva: 'inicio' | 'produtos' | 'pedidos' | 'catalogo' | 'mesas' | 'relatorios' | 'usuarios' | 'estoque';
}

export const Navbar: React.FC<NavbarProps> = ({ abaAtiva }) => {
    const navigate = useNavigate();
    const [dropdownAberto, setDropdownAberto] = useState(false);

    const usuarioLogado = localStorage.getItem('usuario_login') || localStorage.getItem('user') || '';
    const eAdmin = usuarioLogado.toLowerCase() === 'admin';

    const handleSair = (e: React.MouseEvent) => {
        e.preventDefault();
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você será desconectado da sua conta Petit Rose.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#710100',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, sair!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        });
    };

    // Incluído 'estoque' na verificação para manter o botão "Gerenciamento" destacado se estiver na página
    const eGerenciamentoAtivo = ['produtos', 'usuarios', 'relatorios', 'estoque'].includes(abaAtiva);

    return (
        <div className="navbar">
            <img
                src={logoBarraPetitRose}
                alt="Logo Petit Rose"
                className="navbar-logo"
                onClick={() => navigate(eAdmin ? '/menu-admin' : '/menu-cliente')}
                style={{ cursor: 'pointer' }}
            />
            <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={() => navigate(eAdmin ? '/menu-admin' : '/menu-funcionario')}
                    className={`nav-btn ${abaAtiva === 'inicio' ? 'ativo' : ''}`}
                >
                    Início
                </button>

                <button
                    onClick={() => navigate('/catalogo')}
                    className={`nav-btn ${abaAtiva === 'catalogo' ? 'ativo' : ''}`}
                >
                    Catálogo
                </button>

                <button
                    onClick={() => navigate('/pedidos')}
                    className={`nav-btn ${abaAtiva === 'pedidos' ? 'ativo' : ''}`}
                >
                    Pedidos
                </button>

                <button
                    onClick={() => navigate('/gerenciamento-mesas')}
                    className={`nav-btn ${abaAtiva === 'mesas' ? 'ativo' : ''}`}
                >
                    Mesas
                </button>

                {eAdmin && (
                    <div
                        className="dropdown-container"
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setDropdownAberto(true)}
                        onMouseLeave={() => setDropdownAberto(false)}
                    >
                        <button
                            className={`nav-btn ${eGerenciamentoAtivo ? 'ativo' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            Gerenciamento <BiChevronDown size={18} />
                        </button>

                        {dropdownAberto && (
                            <div
                                className="dropdown-menu"
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    backgroundColor: '#fcb1b0', // Fundo rosa oficial da Navbar
                                    minWidth: '100%',           // Exatamente a mesma largura do botão pai
                                    boxShadow: '0px 8px 16px rgba(0,0,0,0.15)',
                                    borderRadius: '10px',
                                    zIndex: 1000,
                                    padding: '5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    border: '1px solid #fbbfc5'
                                }}
                            >
                                <button
                                    onClick={() => navigate('/produtos')}
                                    className={`nav-btn ${abaAtiva === 'produtos' ? 'ativo' : ''}`}
                                    style={{ width: '100%', textAlign: 'left', fontSize: '16px' }}
                                >
                                    Produtos
                                </button>
                                <button
                                    onClick={() => navigate('/usuarios')}
                                    className={`nav-btn ${abaAtiva === 'usuarios' ? 'ativo' : ''}`}
                                    style={{ width: '100%', textAlign: 'left', fontSize: '16px' }}
                                >
                                    Usuários
                                </button>
                                <button
                                    onClick={() => navigate('/controle-estoque')}
                                    className={`nav-btn ${abaAtiva === 'estoque' ? 'ativo' : ''}`}
                                    style={{ width: '100%', textAlign: 'left', fontSize: '16px' }}
                                >
                                    Estoque
                                </button>
                                <button
                                    onClick={() => navigate('/relatorios')}
                                    className={`nav-btn ${abaAtiva === 'relatorios' ? 'ativo' : ''}`}
                                    style={{ width: '100%', textAlign: 'left', fontSize: '16px' }}
                                >
                                    Relatórios
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button className="nav-btn" id="btn-sair" onClick={handleSair}>
                    Sair
                </button>

                <span className="menu-icon">☰</span>
            </div>
        </div>
    );
};