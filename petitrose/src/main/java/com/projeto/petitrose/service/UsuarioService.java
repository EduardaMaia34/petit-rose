package com.projeto.petitrose.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.projeto.petitrose.dto.UsuarioResponseDTO;
import com.projeto.petitrose.dto.UsuarioUpdateDTO;
import com.projeto.petitrose.models.Usuario;
import com.projeto.petitrose.repositories.UsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService{
    @Autowired
    private UsuarioRepository repository;

    //autenticacao
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails usuario = repository.findByEmail(email);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado com o email informado.");
        }
        return usuario;
    }

    //listar usuarios
    public List<UsuarioResponseDTO> listarTodos(){
        return repository.findAll()
        .stream()
        .map(UsuarioResponseDTO::new)
        .collect(Collectors.toList());
    }

    //buscar por id
    public UsuarioResponseDTO buscarPorId(UUID id){
        Usuario usuario = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        return new UsuarioResponseDTO(usuario);
    }

    //atualizar usuario
    public UsuarioResponseDTO atualizar(UUID id, UsuarioUpdateDTO dados) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        if (dados.nome() != null) {
            usuario.setNome(dados.nome());
        }
        
        if (dados.email() != null) {
            var usuarioExistente = repository.findByEmail(dados.email());
            if (usuarioExistente != null && !usuario.getEmail().equals(dados.email())) {
                throw new RuntimeException("Este email já está em uso por outro usuário.");
            }
            usuario.setEmail(dados.email());
        }

        if (dados.gerente() != null) {
            usuario.setGerente(dados.gerente());
        }

        Usuario usuarioAtualizado = repository.save(usuario);
        return new UsuarioResponseDTO(usuarioAtualizado);
    }

    // deletar usuário
    public void deletar(UUID id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
        repository.delete(usuario);
    }
}
