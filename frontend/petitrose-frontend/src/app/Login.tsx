import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importado o hook de navegação
import Swal from 'sweetalert2';
import axios from 'axios';
import '../index.css';
import logoPetitRose from '../assets/Logo.png';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate(); // 2. Inicializado o navigate

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/usuarios/login', {
                email: email,
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
                    // 3. Redireciona para o menu cliente assim que o usuário clica em "OK"
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
                            <a href="/cadastrar" className="register-link">CADASTRAR USUÁRIO</a>
                        </div>
                        <button type="submit" className="login-btn btn-padrao">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    );
};