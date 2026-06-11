package com.projeto.petitrose.dto;

public record UsuarioUpdateDTO(
    String nome,
    String user,
    Boolean gerente
) {}