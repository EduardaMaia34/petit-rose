package com.projeto.petitrose.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProdutoDTO(@NotBlank String nome, @NotNull @Positive float valor) {
}