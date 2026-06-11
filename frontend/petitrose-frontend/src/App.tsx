// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './app/Login';
import { Cadastro } from './app/Cadastrar';
import { MenuCliente } from './app/MenuCliente';
import { MenuAdmin } from './app/MenuAdmin';
import { ListaProdutos } from './app/ListaProdutos';
import { CadastroProduto } from './app/CadastroProduto';
import { EditarProduto } from './app/EditarProduto';
import { Catalogo } from './app/Catalogo';

import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas de Autenticação */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastrar" element={<Cadastro />} />

                {/* Painéis Principais (Dashboards) */}
                <Route path="/menu-cliente" element={<MenuCliente />} />
                <Route path="/menu-admin" element={<MenuAdmin />} />

                {/* Rotas de Gerenciamento do Menu Admin */}
                <Route path="/produtos" element={<ListaProdutos />} />
                <Route path="/produtos/novo" element={<CadastroProduto />} />
                <Route path="/produtos/editar/:id" element={<EditarProduto />} />

                {/* 2. Rota adicionada para o Catálogo de Doces */}
                <Route path="/catalogo" element={<Catalogo />} />

                {/* Rota de Fallback (Redireciona qualquer URL inválida para o Login) */}
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;