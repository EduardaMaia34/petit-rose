package com.projeto.petitrose.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemPedidoRequestDTO(
        UUID produtoId,
        Integer quantidade,
        BigDecimal precoUnitario, // Se o preço vier fixo do front, se não, pode remover daqui
        String observacao
) {}