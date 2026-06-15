package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.TransacaoRequestDTO;
import com.projeto.petitrose.dto.TransacaoResponseDTO;
import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.TipoTransacao;
import com.projeto.petitrose.models.Transacao;
import com.projeto.petitrose.repositories.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    // 👑 COLOQUE ESTE MÉTODO COMPLETO NO SEU com.projeto.petitrose.service.TransacaoService
    public TransacaoResponseDTO cadastrar(TransacaoRequestDTO dto) {
        Transacao transacao = new Transacao();
        transacao.setTipo(dto.tipo());
        transacao.setItem(dto.item());
        transacao.setValor(dto.valor());
        transacao.setData(dto.data() != null ? dto.data() : LocalDateTime.now());
        transacao.setMetodoPagamento(dto.metodoPagamento());

        // 🔥 CORREÇÃO DA LÓGICA: Se vier do modal de despesas (Saída), assume 1. Se vier de vendas, usa a qtd enviada.
        if (dto.quantidade() != null) {
            transacao.setQuantidade(dto.quantidade());
        } else {
            transacao.setQuantidade(1);
        }

        Transacao salva = transacaoRepository.save(transacao);
        return converterParaDTO(salva);
    }

    public List<TransacaoResponseDTO> listarComFiltros(
            TipoTransacao tipo,
            MetodoPagamento metodoPagamento,
            String item,
            LocalDateTime dataInicio,
            LocalDateTime dataFim) {

        Specification<Transacao> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (tipo != null) {
                predicates.add(criteriaBuilder.equal(root.get("tipo"), tipo));
            }
            if (metodoPagamento != null) {
                predicates.add(criteriaBuilder.equal(root.get("metodoPagamento"), metodoPagamento));
            }
            if (item != null && !item.isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("item")),
                        "%" + item.toLowerCase() + "%"
                ));
            }
            if (dataInicio != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("data"), dataInicio));
            }
            if (dataFim != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("data"), dataFim));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return transacaoRepository.findAll(spec).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public void deletar(UUID id) {
        if (!transacaoRepository.existsById(id)) {
            throw new RuntimeException("Transação não encontrada");
        }
        transacaoRepository.deleteById(id);
    }

    private TransacaoResponseDTO converterParaDTO(Transacao transacao) {
        return new TransacaoResponseDTO(
                transacao.getId(),
                transacao.getTipo(),
                transacao.getItem(),
                transacao.getValor(),
                transacao.getData(),
                transacao.getMetodoPagamento()
        );
    }
}
