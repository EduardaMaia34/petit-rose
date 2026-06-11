package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.Usuario;
import java.util.UUID;

public record UsuarioResponseDTO(
    UUID id,
    String nome,
    String user,
    Boolean gerente
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getUser(), usuario.getGerente());
    }
}