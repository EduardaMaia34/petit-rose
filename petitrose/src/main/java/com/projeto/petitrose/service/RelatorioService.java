package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ItemVendidoDTO;
import com.projeto.petitrose.dto.RelatorioFluxoCaixaDTO;
import com.projeto.petitrose.dto.TransacaoResponseDTO;
import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.TipoTransacao;
import com.projeto.petitrose.models.Transacao;
import com.projeto.petitrose.repositories.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RelatorioService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    public RelatorioFluxoCaixaDTO gerarRelatorioFluxoCaixa(LocalDateTime inicio, LocalDateTime fim) {
        // Fetch all transactions in the date range
        Specification<Transacao> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (inicio != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("data"), inicio));
            }
            if (fim != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("data"), fim));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        List<Transacao> transacoes = transacaoRepository.findAll(spec);

        BigDecimal totalEntradas = BigDecimal.ZERO;
        BigDecimal totalSaidas = BigDecimal.ZERO;

        Map<String, BigDecimal> faturamentoPorMetodo = new HashMap<>();
        Map<String, BigDecimal> despesaPorMetodo = new HashMap<>();

        // Initialize maps with zero for all payment methods
        for (MetodoPagamento metodo : MetodoPagamento.values()) {
            faturamentoPorMetodo.put(metodo.name(), BigDecimal.ZERO);
            despesaPorMetodo.put(metodo.name(), BigDecimal.ZERO);
        }

        Map<String, ItemVendidoAcumulador> itensVendidosMap = new HashMap<>();
        List<TransacaoResponseDTO> transacoesDTOs = new ArrayList<>();

        for (Transacao transacao : transacoes) {
            BigDecimal valor = transacao.getValor() != null ? transacao.getValor() : BigDecimal.ZERO;
            String metodoStr = transacao.getMetodoPagamento() != null ? transacao.getMetodoPagamento().name() : "";

            transacoesDTOs.add(new TransacaoResponseDTO(
                    transacao.getId(),
                    transacao.getTipo(),
                    transacao.getItem(),
                    valor,
                    transacao.getData(),
                    transacao.getMetodoPagamento()
            ));

            if (transacao.getTipo() == TipoTransacao.ENTRADA) {
                totalEntradas = totalEntradas.add(valor);

                if (!metodoStr.isEmpty()) {
                    faturamentoPorMetodo.put(metodoStr, faturamentoPorMetodo.getOrDefault(metodoStr, BigDecimal.ZERO).add(valor));
                }

                // Group as sold item
                String itemNome = transacao.getItem();
                ItemVendidoAcumulador acum = itensVendidosMap.computeIfAbsent(itemNome, k -> new ItemVendidoAcumulador(itemNome));
                acum.add(1L, valor);
            } else if (transacao.getTipo() == TipoTransacao.SAIDA) {
                totalSaidas = totalSaidas.add(valor);

                if (!metodoStr.isEmpty()) {
                    despesaPorMetodo.put(metodoStr, despesaPorMetodo.getOrDefault(metodoStr, BigDecimal.ZERO).add(valor));
                }
            }
        }

        BigDecimal saldo = totalEntradas.subtract(totalSaidas);

        List<ItemVendidoDTO> itensMaisVendidos = itensVendidosMap.values().stream()
                .map(acum -> new ItemVendidoDTO(acum.nomeProduto, acum.quantidade, acum.subtotal))
                .sorted(Comparator.comparing(ItemVendidoDTO::quantidade).reversed())
                .collect(Collectors.toList());

        // Sort transactions by date descending (most recent first)
        transacoesDTOs.sort(Comparator.comparing(TransacaoResponseDTO::data).reversed());

        return new RelatorioFluxoCaixaDTO(
                inicio,
                fim,
                totalEntradas,
                totalSaidas,
                saldo,
                faturamentoPorMetodo,
                despesaPorMetodo,
                itensMaisVendidos,
                transacoesDTOs
        );
    }

    private static class ItemVendidoAcumulador {
        final String nomeProduto;
        long quantidade = 0;
        BigDecimal subtotal = BigDecimal.ZERO;

        ItemVendidoAcumulador(String nomeProduto) {
            this.nomeProduto = nomeProduto;
        }

        void add(long quant, BigDecimal valor) {
            this.quantidade += quant;
            this.subtotal = this.subtotal.add(valor);
        }
    }
}
