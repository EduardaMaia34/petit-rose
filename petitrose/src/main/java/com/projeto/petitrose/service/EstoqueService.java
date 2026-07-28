package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ItemEstoqueResponseDTO;
import com.projeto.petitrose.models.ItemEstoque;
import com.projeto.petitrose.repositories.ItemEstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EstoqueService {

    @Autowired
    private ItemEstoqueRepository itemEstoqueRepository;

    public float calcularPorcentagem(ItemEstoque item) {
        if (item == null || item.getCapacityMaxima() <= 0) return 0;
        return ((float) item.getQuantidadeAtual() / item.getCapacityMaxima()) * 100;
    }

    public String verificarStatusEstoque(ItemEstoque item) {
        float porcentagem = calcularPorcentagem(item);
        if (porcentagem <= 25) return "Baixo Estoque";
        if (porcentagem <= 50) return "Médio";
        return "Cheio";
    }

    public List<ItemEstoqueResponseDTO> listarItensEstoque() {
        return itemEstoqueRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ItemEstoqueResponseDTO editarQuantidade(UUID itemId, ItemEstoque dadosAtualizados) {
        ItemEstoque itemExistente = itemEstoqueRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item de estoque não encontrado."));

        itemExistente.setQuantidadeAtual(dadosAtualizados.getQuantidadeAtual());
        itemExistente.setCapacityMaxima(dadosAtualizados.getCapacityMaxima());

        ItemEstoque salvo = itemEstoqueRepository.save(itemExistente);
        return converterParaDTO(salvo);
    }

    // 🔥 Método corrigido para bater com os 9 parâmetros do DTO de forma síncrona
    private ItemEstoqueResponseDTO converterParaDTO(ItemEstoque item) {
        return new ItemEstoqueResponseDTO(
                item.getId(),
                item.getInsumo().getId(),
                item.getInsumo().getNome(),
                item.getQuantidadeAtual(),
                item.getCapacityMaxima(),
                calcularPorcentagem(item),
                verificarStatusEstoque(item),
                item.getInsumo().getCategoria(),
                item.getInsumo().getUnidade()
        );
    }
}