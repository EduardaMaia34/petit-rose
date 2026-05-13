// src/app/Login.tsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../index.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Chamada para o seu UsuarioController.java na porta 8081
            const response = await axios.post('http://localhost:8081/usuarios/login', {
                email: email,
                senha: senha
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token); // Salva o JWT para uso futuro

                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Login realizado com sucesso (Teste)',
                    icon: 'success',
                    confirmButtonColor: '#600000'
                });
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                title: 'Erro de Login',
                text: error.response?.data || 'Verifique suas credenciais ou se o Backend está rodando.',
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
                        {/* Certifique-se de que a logo está em public/Logo.png */}
                        <img src="/Logo.png" className="logo-img" alt="Logo Petit Rose" />
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
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
                            <a href="#" className="register-link">CADASTRAR USUÁRIO</a>
                        </div>

                        <button type="submit" className="login-btn">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    );
};