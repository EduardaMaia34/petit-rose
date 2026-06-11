package com.projeto.petitrose.dto;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutResponseDTO(
    BigDecimal valorTotalGeral,
    List<ItemConsolidadoDTO> itensConsolidados
) {}