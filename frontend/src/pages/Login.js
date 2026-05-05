import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Login realizado!');
            } else {
                alert('Erro ao logar');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="outer-box">
            <div className="middle-box">
                <div className="container">
                    <div className="logo-circle"><span>logo petit</span></div>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                        </div>
                        <div className="link-area">
                            <Link to="/cadastro">CADASTRAR USUÁRIO</Link>
                        </div>
                        <button type="submit" className="btn-submit">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;