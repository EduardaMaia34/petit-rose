package com.projeto.petitrose.dto;

import java.util.List;
import java.util.UUID;

public record PedidoRequestDTO(
        UUID comandaId,
        List<ItemPedidoRequestDTO> itens
) {}