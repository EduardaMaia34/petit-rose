package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.MetodoPagamento;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ComandaResponseDTO(
        UUID id,
        Integer numeroMesa,
        LocalDateTime dataAbertura,
        Boolean aberta,
        BigDecimal valorTotalComanda,
        MetodoPagamento metodoPagamento
) {}
