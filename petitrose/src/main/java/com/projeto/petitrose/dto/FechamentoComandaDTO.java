package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.MetodoPagamento;
import jakarta.validation.constraints.NotNull;

public record FechamentoComandaDTO(
    @NotNull MetodoPagamento metodoPagamento
) {}