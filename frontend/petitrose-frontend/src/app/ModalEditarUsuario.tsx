import React, { useState } from 'react';
import { api } from './api';
import Swal from 'sweetalert2';

interface UsuarioData {
    id: string;
    nome: string;
    user: string;
    gerente: boolean;
}

interface EditarProps {
    usuario: UsuarioData;
    onClose: () => void;
    onSucesso: () => void;
}

export const ModalEditarUsuario: React.FC<EditarProps> = ({ usuario, onClose, onSucesso }) => {
    const [nome, setNome] = useState(usuario.nome);
    const [username, setUsername] = useState(usuario.user);
    const [senha, setSenha] = useState('');
    const [isGerente, setIsGerente] = useState(usuario.gerente);

    const lidarComEdicao = async (e: React.FormEvent) => {
        e.preventDefault();
        const dadosAtualizacao: any = { nome, user: username, gerente: isGerente };
        if (senha.trim() !== '') dadosAtualizacao.senha = senha;

        try {
            await api.put(`/usuarios/${usuario.id}`, dadosAtualizacao);
            Swal.fire('Atualizado!', 'Colaborador modificado com sucesso.', 'success');
            onSucesso();
        } catch (error: any) {
            Swal.fire('Erro', error.response?.data || 'Erro ao atualizar dados.', 'error');
        }
    };

    return (
        <div className="modal-backdrop" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(113, 1, 0, 0.25)',
            backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div className="modal-content-wrapper" style={{
                backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px',
                maxWidth: '500px', width: '90%', fontFamily: "'Georgia', serif", color: '#600000',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)', position: 'relative'
            }}>

                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', color: '#a0a0a0', cursor: 'pointer' }}
                >
                    &times;
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-pencil-square" style={{ fontSize: '20px', color: '#600000' }}></i>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#710100' }}>Modificar Colaborador</h3>
                </div>
                <p style={{ margin: '0 0 25px 0', fontSize: '14px', color: '#555', fontFamily: 'sans-serif' }}>Atualize o nível de acesso ou dados operacionais de @{usuario.user}.</p>

                <form onSubmit={lidarComEdicao} style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#600000' }}>Nome Completo</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #fbbfc5', backgroundColor: '#fffaf0', outline: 'none' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#600000' }}>Nome de Usuário</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={usuario.user === 'admin'} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #fbbfc5', backgroundColor: usuario.user === 'admin' ? '#e9ecef' : '#fffaf0', outline: 'none' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#600000' }}>Nova Senha (Opcional)</label>
                        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Deixe em branco para não alterar" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #fbbfc5', backgroundColor: '#fffaf0', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0', backgroundColor: '#fffaf0', padding: '12px', borderRadius: '8px', border: '1px dashed #fbbfc5' }}>
                        <input type="checkbox" id="geral-edt" checked={isGerente} onChange={(e) => setIsGerente(e.target.checked)} disabled={usuario.user === 'admin'} style={{ transform: 'scale(1.2)', cursor: 'pointer', accentColor: '#600000' }} />
                        <label htmlFor="geral-edt" style={{ fontSize: '14px', fontWeight: 'bold', color: '#600000', cursor: 'pointer' }}>Manter cargo de Gerente (Admin)</label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ backgroundColor: '#ffffff', color: '#555555', border: '1px solid #dcdcdc', borderRadius: '10px', padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Georgia', serif" }}
                        >
                            Voltar
                        </button>
                        <button
                            type="submit"
                            style={{ backgroundColor: '#600000', color: '#fff8e6', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Georgia', serif", display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <i className="bi bi-arrow-repeat"></i> Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};