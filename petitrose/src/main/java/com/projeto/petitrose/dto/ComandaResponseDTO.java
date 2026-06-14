package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ComandaResponseDTO(
        UUID id,
        Integer numeroMesa,
        LocalDateTime dataAbertura,
        LocalDateTime dataFechamento,
        Boolean aberta,
        BigDecimal valorTotalComanda,
        MetodoPagamento metodoPagamento,
        List<Pedido> pedidos
) {}