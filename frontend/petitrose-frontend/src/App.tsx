// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './app/Login';
import { Cadastro } from './app/Cadastrar';// Verifique se o caminho está correto
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Login />} />
                <Route path="/cadastrar" element={<Cadastro />} />
            </Routes>
        </Router>
    );
}

export default App;