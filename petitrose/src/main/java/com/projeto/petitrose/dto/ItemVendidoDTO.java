package com.projeto.petitrose.dto;

import java.math.BigDecimal;

public record ItemVendidoDTO(
        String nomeProduto,
        Long quantidade,
        BigDecimal subtotal
) {}
