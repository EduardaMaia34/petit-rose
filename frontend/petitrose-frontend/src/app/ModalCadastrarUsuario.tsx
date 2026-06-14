import React, { useState } from 'react';
import { api } from './api';
import Swal from 'sweetalert2';

interface CadastrarProps {
    onClose: () => void;
    onSucesso: () => void;
}

export const ModalCadastrarUsuario: React.FC<CadastrarProps> = ({ onClose, onSucesso }) => {
    const [nome, setNome] = useState('');
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [isGerente, setIsGerente] = useState(false);

    const lidarComCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/usuarios/register', {
                nome,
                user: username,
                senha,
                gerente: isGerente
            });
            Swal.fire('Sucesso!', 'Novo usuário cadastrado com sucesso!', 'success');
            onSucesso();
        } catch (error: any) {
            Swal.fire('Erro', error.response?.data || 'Erro ao registrar usuário.', 'error');
        }
    };

    return (
        <div className="modal-backdrop" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(113, 1, 0, 0.25)', // Tom rosa/vinho translúcido de fundo
            backdropFilter: 'blur(5px)', // Efeito desfocado suave atrás do modal
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div className="modal-content-wrapper" style={{
                backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px',
                maxWidth: '500px', width: '90%', fontFamily: "'Georgia', serif", color: '#600000',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)', position: 'relative'
            }}>

                {/* Botão de Fechar X superior */}
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', color: '#a0a0a0', cursor: 'pointer' }}
                >
                    &times;
                </button>

                {/* Cabeçalho do Modal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-person-plus-fill" style={{ fontSize: '20px', color: '#600000' }}></i>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#710100' }}>Cadastrar Novo Colaborador</h3>
                </div>
                <p style={{ margin: '0 0 25px 0', fontSize: '14px', color: '#555', fontFamily: 'sans-serif' }}>Crie novas credenciais de acesso para a equipe da Petit Rose.</p>

                <form onSubmit={lidarComCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#600000' }}>Nome Completo</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria Silva" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #fbbfc5', backgroundColor: '#fffaf0', outline: 'none' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#600000' }}>Nome de Usuário (Login)</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ex: mariasilva" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #fbbfc5', backgroundColor: '#fffaf0', outline: 'none' }} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#600000' }}>Senha de Acesso</label>
                        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Crie uma senha forte" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #fbbfc5', backgroundColor: '#fffaf0', outline: 'none' }} required />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0', backgroundColor: '#fffaf0', padding: '12px', borderRadius: '8px', border: '1px dashed #fbbfc5' }}>
                        <input type="checkbox" id="geral-cad" checked={isGerente} onChange={(e) => setIsGerente(e.target.checked)} style={{ transform: 'scale(1.2)', cursor: 'pointer', accentColor: '#600000' }} />
                        <label htmlFor="geral-cad" style={{ fontSize: '14px', fontWeight: 'bold', color: '#600000', cursor: 'pointer' }}>Conceder cargo de Gerente (Admin)</label>
                    </div>

                    {/* Rodapé com os botões arredondados idênticos ao print */}
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
                            <i className="bi bi-check-circle"></i> Salvar Usuário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};