package com.projeto.petitrose.dto;

import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProdutoDTO(
    @NotBlank String nome,
    @NotNull float valor,
    @NotBlank String descricao,
    @NotNull UUID categoriaId,
    String imagemUrl
) {}
