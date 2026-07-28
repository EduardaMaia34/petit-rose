package com.projeto.petitrose.dto;

import java.util.UUID;

public record ItemConsolidadoDTO(
    UUID produtoId,
    String nomeProduto,
    Integer quantidadeTotal,
    java.math.BigDecimal precoUnitario
) {}