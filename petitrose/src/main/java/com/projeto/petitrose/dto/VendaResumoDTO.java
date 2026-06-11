package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.MetodoPagamento;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record VendaResumoDTO(
        UUID comandaId,
        Integer numeroMesa,
        LocalDateTime dataFechamento,
        BigDecimal valorTotal,
        MetodoPagamento metodoPagamento
) {}
