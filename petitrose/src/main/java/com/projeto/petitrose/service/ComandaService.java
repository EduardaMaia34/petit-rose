package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.CheckoutRequestDTO;
import com.projeto.petitrose.dto.CheckoutResponseDTO;
import com.projeto.petitrose.dto.ComandaRequestDTO;
import com.projeto.petitrose.dto.ComandaResponseDTO;
import com.projeto.petitrose.dto.ItemConsolidadoDTO;
import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.models.ItemPedido;
import com.projeto.petitrose.models.TipoTransacao;
import com.projeto.petitrose.models.Transacao;
import com.projeto.petitrose.repositories.ComandaRepository;
import com.projeto.petitrose.repositories.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComandaService {

    @Autowired
    private ComandaRepository comandaRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    // abrir nova comanda
    public ComandaResponseDTO abrirNovaComanda(ComandaRequestDTO dto) {
        Comanda comanda = new Comanda();
        comanda.setNumeroMesa(dto.numeroMesa());
        Comanda comandaSalva = comandaRepository.save(comanda);
        return converterParaDTO(comandaSalva);
    }

    // comendas abertas
    public List<ComandaResponseDTO> buscarComandasAtivas() {
        List<Comanda> comandasAbertas = comandaRepository.findByAberta(true);
        return comandasAbertas.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // comanda por id
    public ComandaResponseDTO buscarPorId(UUID id) {
        Comanda comanda = comandaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada"));
        return converterParaDTO(comanda);
    }

    // fechar comanda individual removendo o vínculo dos pedidos
    @Transactional
    public void fecharComanda(UUID id, MetodoPagamento metodoPagamento) {
        Comanda comanda = comandaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada"));

        if (!comanda.getAberta()) {
            throw new RuntimeException("Esta comanda já está fechada");
        }

        if (metodoPagamento == null) {
            throw new IllegalArgumentException("O método de pagamento é obrigatório para fechar a comanda");
        }

        comanda.setAberta(false);
        comanda.setDataFechamento(LocalDateTime.now());
        comanda.setMetodoPagamento(metodoPagamento);

        // 1. REGISTRAR TRANSAÇÕES ANTES DE LIMPAR O RELACIONAMENTO
        if (comanda.getPedidos() != null && !comanda.getPedidos().isEmpty()) {
            Map<String, BigDecimal> subtotalPorProduto = new HashMap<>();
            
            for (Pedido pedido : comanda.getPedidos()) {
                if (pedido.getItens() != null) {
                    for (ItemPedido item : pedido.getItens()) {
                        if (item.getProduto() != null) {
                            String nomeProduto = item.getProduto().getNome();
                            int quant = item.getQuantidade() != null ? item.getQuantidade() : 0;
                            BigDecimal preco = item.getPrecoUnitario() != null ? item.getPrecoUnitario() : BigDecimal.ZERO;
                            BigDecimal subtotal = preco.multiply(BigDecimal.valueOf(quant));

                            subtotalPorProduto.put(nomeProduto, subtotalPorProduto.getOrDefault(nomeProduto, BigDecimal.ZERO).add(subtotal));
                        }
                    }
                }
            }

            for (Map.Entry<String, BigDecimal> entry : subtotalPorProduto.entrySet()) {
                if (entry.getValue().compareTo(BigDecimal.ZERO) > 0) {
                    Transacao transacao = new Transacao();
                    transacao.setTipo(TipoTransacao.ENTRADA);
                    transacao.setItem(entry.getKey());
                    transacao.setValor(entry.getValue());
                    transacao.setData(comanda.getDataFechamento());
                    transacao.setMetodoPagamento(metodoPagamento);
                    transacaoRepository.save(transacao);
                }
            }
        }

        
        if (comanda.getPedidos() != null && !comanda.getPedidos().isEmpty()) {
            comanda.getPedidos().forEach(pedido -> pedido.setComanda(null));
            comanda.getPedidos().clear();
        }

        comandaRepository.save(comanda);
    }

    // filtrar comandas fechadas por intervalo de datas
    public List<ComandaResponseDTO> buscarComandasFechadasPorPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("As datas de início e fim são obrigatórias.");
        }

        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("A data de início não pode ser posterior à data de fim.");
        }

        LocalDateTime inicioDoDia = dataInicio.withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime fimDoDia = dataFim.withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        List<Comanda> comandasFechadas = comandaRepository.findByAbertaFalseAndDataFechamentoBetween(inicioDoDia, fimDoDia);

        return comandasFechadas.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    
    @Transactional
    public CheckoutResponseDTO processarPagamento(CheckoutRequestDTO request) {
        List<Comanda> comandas = comandaRepository.findAllById(request.comandaIds());
        
        if (comandas.isEmpty()) {
            throw new IllegalArgumentException("Nenhuma comanda encontrada para os IDs fornecidos.");
        }

        if (request.metodoPagamento() == null) {
            throw new IllegalArgumentException("O método de pagamento é obrigatório para processar o checkout");
        }

        // 1. Calcula o total geral antes de alterar qualquer estado
        BigDecimal totalGeral = comandas.stream()
                .map(comanda -> {
                    if (comanda.getPedidos() == null) return BigDecimal.ZERO;
                    return comanda.getPedidos().stream()
                            .map(Pedido::getValorTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Consolida os itens para o DTO de resposta
        List<ItemConsolidadoDTO> itensConsolidados = comandas.stream()
                .filter(comanda -> comanda.getPedidos() != null)
                .flatMap(comanda -> comanda.getPedidos().stream())
                .filter(pedido -> pedido.getItens() != null)
                .flatMap(pedido -> pedido.getItens().stream())
                .collect(Collectors.groupingBy(
                        item -> item.getProduto().getId(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    var primeiroItem = list.get(0);
                                    int qtdTotal = list.stream().mapToInt(item -> item.getQuantidade()).sum();
                                    return new ItemConsolidadoDTO(
                                            primeiroItem.getProduto().getId(),
                                            primeiroItem.getProduto().getNome(),
                                            qtdTotal,
                                            primeiroItem.getPrecoUnitario()
                                    );
                                }
                        )
                ))
                .values()
                .stream()
                .collect(Collectors.toList());

        
        Map<String, BigDecimal> subtotalPorProduto = new HashMap<>();
        
        for (Comanda comanda : comandas) {
            if (comanda.getPedidos() != null) {
                for (Pedido pedido : comanda.getPedidos()) {
                    if (pedido.getItens() != null) {
                        for (ItemPedido item : pedido.getItens()) {
                            if (item.getProduto() != null) {
                                String nomeProduto = item.getProduto().getNome();
                                int quant = item.getQuantidade() != null ? item.getQuantidade() : 0;
                                BigDecimal preco = item.getPrecoUnitario() != null ? item.getPrecoUnitario() : BigDecimal.ZERO;
                                BigDecimal subtotal = preco.multiply(BigDecimal.valueOf(quant));

                                subtotalPorProduto.put(nomeProduto, subtotalPorProduto.getOrDefault(nomeProduto, BigDecimal.ZERO).add(subtotal));
                            }
                        }
                    }
                }
            }
        }

        LocalDateTime agora = LocalDateTime.now();

        for (Map.Entry<String, BigDecimal> entry : subtotalPorProduto.entrySet()) {
            if (entry.getValue().compareTo(BigDecimal.ZERO) > 0) {
                Transacao transacao = new Transacao();
                transacao.setTipo(TipoTransacao.ENTRADA);
                transacao.setItem(entry.getKey());
                transacao.setValor(entry.getValue());
                transacao.setData(agora);
                transacao.setMetodoPagamento(request.metodoPagamento());
                transacaoRepository.save(transacao);
            }
        }

        
        comandas.forEach(comanda -> {
            comanda.setAberta(false);
            comanda.setDataFechamento(agora);
            comanda.setMetodoPagamento(request.metodoPagamento());
            
            if (comanda.getPedidos() != null && !comanda.getPedidos().isEmpty()) {
                comanda.getPedidos().forEach(pedido -> pedido.setComanda(null));
                comanda.getPedidos().clear();
            }
        });
        
        comandaRepository.saveAll(comandas);

        return new CheckoutResponseDTO(totalGeral, itensConsolidados);
    }

    // auxiliar
    private ComandaResponseDTO converterParaDTO(Comanda comanda) {
        BigDecimal valorTotalComanda = BigDecimal.ZERO;
        if (comanda.getPedidos() != null) {
            valorTotalComanda = comanda.getPedidos().stream()
                    .map(Pedido::getValorTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        return new ComandaResponseDTO(
                comanda.getId(),
                comanda.getNumeroMesa(),
                comanda.getDataAbertura(),
                comanda.getDataFechamento(),
                comanda.getAberta(),
                valorTotalComanda,
                comanda.getMetodoPagamento(),
                comanda.getPedidos()
        );
    }
}