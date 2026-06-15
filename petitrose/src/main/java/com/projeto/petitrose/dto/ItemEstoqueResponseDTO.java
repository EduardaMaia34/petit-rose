package com.projeto.petitrose.dto;

import java.util.UUID;

public record ItemEstoqueResponseDTO(
        UUID id,
        UUID insumoId,
        String nomeInsumo,
        Integer quantidadeAtual,
        Integer capacidadeMaxima,
        float porcentagem,
        String status,
        String categoria,
        String unidade
) {}