import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../index.css';
import logoPetitRose from '../assets/Logo.png';

export const Login = () => {
    // 1. Estados declarados de forma única
    const [user, setUser] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 2. Requisição limpa enviando 'user' para o backend
            const response = await axios.post('http://localhost:8081/usuarios/login', {
                user: user,
                senha: senha
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);

                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Login realizado com sucesso!',
                    icon: 'success',
                    confirmButtonColor: '#600000'
                }).then(() => {
                    navigate('/menu-cliente');
                });
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Erro de Login',
                text: error.response?.data || 'Credenciais inválidas.',
                icon: 'error',
                confirmButtonColor: '#600000'
            });
        }
    };

    return (
        <div className="login-outer">
            <div className="login-middle">
                <div className="login-container">
                    <div className="logo-wrapper">
                        <img src={logoPetitRose} className="logo-img" alt="Logo Petit Rose" />
                    </div>
                    <form className="login-form" onSubmit={handleLogin}>

                        {/* Input de Usuário único */}
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Nome de usuário"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input de Senha com o Botão do Olho embutido */}
                        <div className="input-group">
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                style={{ paddingRight: '75px' }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="btn-olho"
                                aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                            >
                                {mostrarSenha ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#600000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#600000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                        <line x1="2" y1="2" x2="22" y2="22"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button type="submit" className="login-btn btn-padrao">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    );
};