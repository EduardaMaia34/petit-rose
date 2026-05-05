import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Cadastro = () => {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', gerente: false });

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/usuarios/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
        } else {
            alert('Erro no cadastro');
        }
    };

    return (
        <div className="outer-box">
            <div className="middle-box">
                <div className="container">
                    <div className="logo-circle"><span>logo petit</span></div>
                    <h1 className="title">CADASTRAR NOVO USUÁRIO</h1>
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <input type="text" placeholder="Nome" onChange={(e) => setFormData({...formData, nome: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Senha" onChange={(e) => setFormData({...formData, senha: e.target.value})} />
                        </div>
                        <button type="submit" className="btn-submit">CADASTRAR</button>
                    </form>
                    <Link to="/" className="back-link">VOLTAR PARA O LOGIN</Link>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;