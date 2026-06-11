package com.projeto.petitrose.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record RelatorioFluxoCaixaDTO(
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        BigDecimal faturamentoTotal,
        Map<String, BigDecimal> faturamentoPorMetodoPagamento,
        List<ItemVendidoDTO> itensMaisVendidos,
        List<VendaResumoDTO> vendas
) {}
