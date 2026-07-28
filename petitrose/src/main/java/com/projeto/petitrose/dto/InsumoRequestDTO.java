package com.projeto.petitrose.dto;

import java.math.BigDecimal;

public record InsumoRequestDTO(
    String nome,
    BigDecimal valorUnitario,
    Integer quantidadeAtual, 
    Integer capacidadeMaxima,
    String categoria,
    String unidade
) {}