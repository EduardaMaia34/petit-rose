// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './app/Login';
import { Cadastro } from './app/Cadastrar';
import { MenuCliente } from './app/MenuCliente';
import { MenuAdmin } from './app/MenuAdmin';
import { ListaProdutos } from './app/ListaProdutos';
import { CadastroProduto } from './app/CadastroProduto';
import { EditarProduto } from './app/EditarProduto';

import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastrar" element={<Cadastro />} />

                <Route path="/menu-cliente" element={<MenuCliente />} />
                <Route path="/menu-admin" element={<MenuAdmin />} />

                <Route path="/produtos" element={<ListaProdutos />} />
                <Route path="/produtos/novo" element={<CadastroProduto />} />
                <Route path="/produtos/editar/:id" element={<EditarProduto />} />

                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;