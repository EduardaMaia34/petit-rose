package com.projeto.petitrose.dto;

import jakarta.validation.constraints.NotNull;

public record ComandaRequestDTO(
        @NotNull(message = "O número da mesa é obrigatório")
        Integer numeroMesa
) {}