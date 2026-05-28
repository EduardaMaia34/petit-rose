import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/usuarios' // URL do seu UsuarioController
});

export const loginRequest = async (email: string, senha: string) => {
    return api.post('/login', { email, senha });
};

export const registerRequest = async (nome: string, email: string, senha: string) => {
    return api.post('/register', { nome, email, senha, gerente: false });
};