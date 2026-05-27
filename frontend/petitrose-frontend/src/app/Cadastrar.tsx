import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../index.css';
import logoPetitRose from '../assets/Logo.png';

export const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/usuarios/register', {
                nome: nome,
                email: email,
                senha: senha,
                gerente: false // valor padrão conforme seu controller espera
            });

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Conta criada com sucesso!',
                    icon: 'success',
                    confirmButtonColor: '#600000'
                }).then(() => navigate('/login'));
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Erro no Cadastro',
                text: error.response?.data || 'Erro ao criar conta.',
                icon: 'error',
                confirmButtonColor: '#600000'
            });
        }
    };

    return (
        <div className="login-outer">
            <div className="login-middle">
                <div className="login-container cadastro-container">
                    <div className="logo-wrapper">
                        <img src={logoPetitRose} className="logo-img" alt="Logo Petit Rose" />
                    </div>
                    <h2 style={{marginTop: '100px', color: '#600000'}}>CADASTRAR USUÁRIO</h2>
                    <form className="login-form" style={{marginTop: '20px'}} onSubmit={handleCadastro}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Nome Completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        <div className="register-link-wrapper">
                            <a href="/login" className="register-link">JÁ POSSUO CONTA</a>
                        </div>
                        <button type="submit" className="login-btn btn-padrao">CRIAR CONTA</button>
                    </form>
                </div>
            </div>
        </div>
    );
};