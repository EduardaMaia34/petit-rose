// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { ListaPedidos } from './app/ListaPedidos';
import { NovoPedido } from './app/NovoPedido';
import {EditarPedido} from "./app/EditarPedido.tsx";
import { ListaUsuarios } from './app/ListaUsuarios';

import './index.css';

interface RotaProtegidaProps {
    children: React.JSX.Element;
}

const RotaAdminProtegida: React.FC<RotaProtegidaProps> = ({ children }) => {
    const token = localStorage.getItem('token');

    // Se não tiver token nenhum, manda para o login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};



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

                <Route path="/pedidos" element={<ListaPedidos />} />
                <Route path="/pedidos/novo" element={<NovoPedido />} />
                <Route path="/pedidos/editar/:id" element={<EditarPedido />} />

                <Route
                    path="/usuarios"
                    element={
                        <RotaAdminProtegida>
                            <ListaUsuarios />
                        </RotaAdminProtegida>
                    } />

                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}



export default App;