package com.projeto.petitrose.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projeto.petitrose.dto.UsuarioResponseDTO;
import com.projeto.petitrose.dto.UsuarioUpdateDTO;
import com.projeto.petitrose.models.Usuario;
import com.projeto.petitrose.repositories.UsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String user) throws UsernameNotFoundException {
        Usuario usuario = repository.findByUser(user);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado com o login informado.");
        }
        return usuario;
    }

    public List<UsuarioResponseDTO> listarTodos(){
        return repository.findAll()
                .stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO buscarPorId(UUID id){
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return new UsuarioResponseDTO(usuario);
    }

    public UsuarioResponseDTO atualizar(UUID id, UsuarioUpdateDTO dados) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        if (dados.nome() != null) {
            usuario.setNome(dados.nome());
        }

        if (dados.user() != null) {
            Usuario usuarioExistente = repository.findByUser(dados.user());
            if (usuarioExistente != null && !usuario.getId().equals(usuarioExistente.getId())) {
                throw new RuntimeException("Este nome de usuário já está em uso.");
            }
            usuario.setUser(dados.user());
        }

        if (dados.gerente() != null) {
            usuario.setGerente(dados.gerente());
        }

        // 🔥 Agora compila perfeitamente porque injetamos o passwordEncoder acima!
        if (dados.senha() != null && !dados.senha().trim().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(dados.senha()));
        }

        Usuario usuarioAtualizado = repository.save(usuario);
        return new UsuarioResponseDTO(usuarioAtualizado);
    }

    public void deletar(UUID id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
        repository.delete(usuario);
    }
}