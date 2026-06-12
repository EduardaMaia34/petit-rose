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
import { DashboardFinanceiro } from './app/DashboardFinanceiro';
import { ControleEstoque } from './app/ControleEstoque';
import { Relatorios } from './app/Relatorios';
import { AtendimentoBalcao } from './app/AtendimentoBalcao';
import { GerenciamentoMesas } from './app/GerenciamentoMesas';

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

                <Route path="/produtos" element={<ListaProdutos />} />
                <Route path="/produtos/novo" element={<CadastroProduto />} />
                <Route path="/produtos/editar/:id" element={<EditarProduto />} />
                <Route path="/dashboard" element={<MenuAdmin />} />
                <Route path="/dashboard-financeiro" element={<DashboardFinanceiro />} />
                <Route path="/controle-estoque" element={<ControleEstoque />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/atendimento-balcao" element={<AtendimentoBalcao />} />
                <Route path="/gerenciamento-mesas" element={<GerenciamentoMesas />} />

                {/* 2. Rota adicionada para o Catálogo de Doces */}
                <Route path="/catalogo" element={<Catalogo />} />

                {/* Rota de Fallback (Redireciona qualquer URL inválida para o Login) */}
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;