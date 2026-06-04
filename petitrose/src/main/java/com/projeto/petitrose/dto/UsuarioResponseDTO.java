package com.projeto.petitrose.dto;


import java.util.UUID;

import com.projeto.petitrose.models.Usuario;

public record UsuarioResponseDTO(UUID id, String nome, String email, Boolean gerente) {
    
    //entidade em dto
    public UsuarioResponseDTO(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getGerente());
    }
}