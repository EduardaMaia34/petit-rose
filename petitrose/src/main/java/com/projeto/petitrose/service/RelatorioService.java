package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ItemVendidoDTO;
import com.projeto.petitrose.dto.RelatorioFluxoCaixaDTO;
import com.projeto.petitrose.dto.VendaResumoDTO;
import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.ItemPedido;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.repositories.ComandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RelatorioService {

    @Autowired
    private ComandaRepository comandaRepository;

    public RelatorioFluxoCaixaDTO gerarRelatorioFluxoCaixa(LocalDateTime inicio, LocalDateTime fim) {
        // Buscar as comandas fechadas no período
        List<Comanda> comandas = comandaRepository.findByAbertaFalseAndDataFechamentoBetween(inicio, fim);

        BigDecimal faturamentoTotal = BigDecimal.ZERO;
        Map<String, BigDecimal> faturamentoPorMetodo = new HashMap<>();

        // Inicializar o mapa com todos os métodos de pagamento para garantir que apareçam com valor zero se não houver vendas
        for (var metodo : com.projeto.petitrose.models.MetodoPagamento.values()) {
            faturamentoPorMetodo.put(metodo.name(), BigDecimal.ZERO);
        }

        List<VendaResumoDTO> vendas = new ArrayList<>();
        Map<String, ItemVendidoAcumulador> itensVendidosMap = new HashMap<>();

        for (Comanda comanda : comandas) {
            // Calcular valor total da comanda
            BigDecimal valorComanda = BigDecimal.ZERO;
            if (comanda.getPedidos() != null) {
                valorComanda = comanda.getPedidos().stream()
                        .map(Pedido::getValorTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            faturamentoTotal = faturamentoTotal.add(valorComanda);

            // Somar por método de pagamento
            if (comanda.getMetodoPagamento() != null) {
                String metodoStr = comanda.getMetodoPagamento().name();
                BigDecimal atual = faturamentoPorMetodo.getOrDefault(metodoStr, BigDecimal.ZERO);
                faturamentoPorMetodo.put(metodoStr, atual.add(valorComanda));
            }

            // Adicionar à lista de vendas individuais
            vendas.add(new VendaResumoDTO(
                    comanda.getId(),
                    comanda.getNumeroMesa(),
                    comanda.getDataFechamento(),
                    valorComanda,
                    comanda.getMetodoPagamento()
            ));

            // Agrupar itens vendidos
            if (comanda.getPedidos() != null) {
                for (Pedido pedido : comanda.getPedidos()) {
                    if (pedido.getItens() != null) {
                        for (ItemPedido item : pedido.getItens()) {
                            if (item.getProduto() != null) {
                                String nomeProduto = item.getProduto().getNome();
                                int quant = item.getQuantidade() != null ? item.getQuantidade() : 0;
                                BigDecimal preco = item.getPrecoUnitario() != null ? item.getPrecoUnitario() : BigDecimal.ZERO;
                                BigDecimal subtotal = preco.multiply(BigDecimal.valueOf(quant));

                                ItemVendidoAcumulador acum = itensVendidosMap.computeIfAbsent(nomeProduto,
                                        k -> new ItemVendidoAcumulador(nomeProduto));
                                acum.add(quant, subtotal);
                            }
                        }
                    }
                }
            }
        }

        // Converter o mapa de itens vendidos em lista de DTOs ordenada por quantidade decrescente
        List<ItemVendidoDTO> itensMaisVendidos = itensVendidosMap.values().stream()
                .map(acum -> new ItemVendidoDTO(acum.nomeProduto, acum.quantidade, acum.subtotal))
                .sorted(Comparator.comparing(ItemVendidoDTO::quantidade).reversed())
                .collect(Collectors.toList());

        // Ordenar vendas por data de fechamento mais recente
        vendas.sort(Comparator.comparing(VendaResumoDTO::dataFechamento).reversed());

        return new RelatorioFluxoCaixaDTO(
                inicio,
                fim,
                faturamentoTotal,
                faturamentoPorMetodo,
                itensMaisVendidos,
                vendas
        );
    }

    // Classe auxiliar interna para agrupar quantidades e subtotais por produto
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
