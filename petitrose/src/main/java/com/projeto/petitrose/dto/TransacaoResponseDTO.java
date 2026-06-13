package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransacaoResponseDTO(
        UUID id,
        TipoTransacao tipo,
        String item,
        BigDecimal valor,
        LocalDateTime data,
        MetodoPagamento metodoPagamento
) {}
