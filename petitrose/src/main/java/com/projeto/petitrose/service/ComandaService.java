package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ComandaRequestDTO;
import com.projeto.petitrose.dto.ComandaResponseDTO;
import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.repositories.ComandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComandaService {

    @Autowired
    private ComandaRepository comandaRepository;

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
                comanda.getDataFechamento(),
                comanda.getAberta(),
                valorTotalComanda,
                comanda.getMetodoPagamento()
        );
    }
}