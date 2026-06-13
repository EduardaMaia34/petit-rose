package com.projeto.petitrose.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record RelatorioFluxoCaixaDTO(
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        BigDecimal totalEntradas,
        BigDecimal totalSaidas,
        BigDecimal saldo,
        Map<String, BigDecimal> faturamentoPorMetodoPagamento,
        Map<String, BigDecimal> despesaPorMetodoPagamento,
        List<ItemVendidoDTO> itensMaisVendidos,
        List<TransacaoResponseDTO> transacoes
) {}
