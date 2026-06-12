package com.projeto.petitrose.dto;

import java.util.UUID;

public record ItemEstoqueResponseDTO(
    UUID id,
    UUID insumoId,
    String nomeInsumo,
    int quantidadeAtual,
    int capacidadeMaxima,
    float porcentagem,
    String status
) {}