package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.StatusPedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PedidoResponseDTO(
        UUID id,
        LocalDateTime dataCriacao,
        StatusPedido status,
        BigDecimal valorTotal,
        UUID comandaId
) {}