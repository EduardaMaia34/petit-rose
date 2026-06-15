package com.projeto.petitrose.dto;

import java.util.UUID;

public record EstoqueResponseDTO(
    UUID id,
    String nomeInsumo,
    int quantidadeAtual,
    int capacidadeMaxima,
    float porcentagem,
    String status,
    String categoria,
    String unidade

) {}