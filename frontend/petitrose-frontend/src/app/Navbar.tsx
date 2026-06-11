import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logoBarraPetitRose from '../assets/LogoBarra.png';

interface NavbarProps {
    abaAtiva: 'inicio' | 'produtos' | 'pedidos' | 'clientes' | 'relatorios';
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
                localStorage.removeItem('token'); // Limpa o token
                navigate('/login');
            }
        });
    };

    return (
        <div className="navbar">
            <img src={logoBarraPetitRose} alt="Logo Petit Rose" className="navbar-logo" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}} />
            <div className="navbar-menu">
                <button onClick={() => navigate('/menu-cliente')} className={`nav-btn ${abaAtiva === 'inicio' ? 'ativo' : ''}`}>Início</button>
                <button onClick={() => navigate('/produtos')} className={`nav-btn ${abaAtiva === 'produtos' ? 'ativo' : ''}`}>Produtos</button>
                <button className="nav-btn" disabled>Pedidos</button>
                <button className="nav-btn" disabled>Clientes</button>
                <button className="nav-btn" disabled>Relatórios</button>
                <a href="/login" id="btn-sair" className="nav-btn">Sair</a>
                <span className="menu-icon">☰</span>
            </div>
        </div>
    );
};