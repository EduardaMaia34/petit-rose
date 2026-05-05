import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rota para a página de Login (raiz) */}
                <Route path="/" element={<Login />} />

                {/* Rota para a página de Cadastro */}
                <Route path="/cadastro" element={<Cadastro />} />
            </Routes>
        </Router>
    );
}

export default App;