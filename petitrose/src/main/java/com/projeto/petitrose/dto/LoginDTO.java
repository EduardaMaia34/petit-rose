package com.projeto.petitrose.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
    @NotBlank(message = "O usuário é obrigatório.")
    String user,
    
    @NotBlank(message = "A senha é obrigatória.")
    String senha
) {}