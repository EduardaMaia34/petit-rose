import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logoBarraPetitRose from '../assets/LogoBarra.png';

interface NavbarProps {
    // Define estritamente quais são as abas válidas do sistema
    abaAtiva: 'inicio' | 'produtos' | 'pedidos' | 'catalogo' | 'mesas' | 'relatorios' | 'usuarios';
}

export const Navbar: React.FC<NavbarProps> = ({ abaAtiva }) => {
    const navigate = useNavigate();

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
                localStorage.removeItem('token'); // Limpa o token de autenticação
                navigate('/login');
            }
        });
    };

    return (
        <div className="navbar">
            <img
                src={logoBarraPetitRose}
                alt="Logo Petit Rose"
                className="navbar-logo"
                onClick={() => navigate('/menu-cliente')} // Redireciona para o Início ao clicar na logo
                style={{ cursor: 'pointer' }}
            />
            <div className="navbar-menu">
                {/* Aba Início: Só fica ativa se abaAtiva === 'inicio' */}
                <button
                    onClick={() => navigate('/menu-cliente')}
                    className={`nav-btn ${abaAtiva === 'inicio' ? 'ativo' : ''}`}
                >
                    Início
                </button>

                {/* Aba Produtos: Só fica ativa se abaAtiva === 'produtos' */}
                <button
                    onClick={() => navigate('/produtos')}
                    className={`nav-btn ${abaAtiva === 'produtos' ? 'ativo' : ''}`}
                >
                    Produtos
                </button>

                <button
                    onClick={() => navigate('/catalogo')}
                    className={`nav-btn ${abaAtiva === 'catalogo' ? 'ativo' : ''}`}
                >
                    Catálogo
                </button>

                {/* Aba Pedidos: Só fica ativa se abaAtiva === 'pedidos' */}
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

                {/* Aba Relatórios: Só fica ativa se abaAtiva === 'relatorios' */}
                <button
                    onClick={() => navigate('/relatorios')}
                    className={`nav-btn ${abaAtiva === 'relatorios' ? 'ativo' : ''}`}
                >
                    Relatórios
                </button>

                <button
                    onClick={() => navigate('/usuarios')}
                    className={`nav-btn ${abaAtiva === 'usuarios' ? 'ativo' : ''}`}
                >
                    Usuários
                </button>

                {/* Botão de Sair */}
                <button
                    className="nav-btn"
                    id="btn-sair"
                    onClick={handleSair}
                >
                    Sair
                </button>

                <span className="menu-icon">☰</span>
            </div>
        </div>
    );
};