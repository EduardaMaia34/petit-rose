package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.StatusPedido;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record PedidoRequestDTO(
        UUID clienteId,
        UUID comandaId,
        BigDecimal valorTotal,
        StatusPedido status,
        List<ItemPedidoRequestDTO> itens
) {}