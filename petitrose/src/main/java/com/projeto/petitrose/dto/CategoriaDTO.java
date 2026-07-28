package com.projeto.petitrose.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaDTO(
    @NotBlank(message = "O nome da categoria não pode estar em branco.")
    @Size(max = 50, message = "O nome da categoria deve ter no máximo 50 caracteres.")
    String nome
) {
}