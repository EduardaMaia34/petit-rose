package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ComandaRequestDTO;
import com.projeto.petitrose.dto.ComandaResponseDTO;
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
        // 'dataAbertura' e 'aberta' já têm valores padrão na sua entidade

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

    // fechar comanda
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

        comandaRepository.save(comanda);

        // Registrar transações financeiras para cada item/produto vendido
        if (comanda.getPedidos() != null) {
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
    }

    // auxiliar
    private ComandaResponseDTO converterParaDTO(Comanda comanda) {
        // Sacada legal: Soma o valorTotal de todos os pedidos vinculados a essa comanda
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
                comanda.getAberta(),
                valorTotalComanda,
                comanda.getMetodoPagamento()
        );
    }
}