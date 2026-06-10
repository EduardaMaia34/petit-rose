package com.projeto.petitrose.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterDTO(
    @NotBlank(message = "O nome é obrigatório.")
    String nome,
    
    @NotBlank(message = "O usuário é obrigatório.")
    String user,
    
    @NotBlank(message = "A senha é obrigatória.")
    String senha,
    
    @NotNull
    Boolean gerente // Define se será ADMIN ou USER normal
) {}