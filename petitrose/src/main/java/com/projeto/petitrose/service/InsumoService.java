package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ItemEstoqueResponseDTO;
import com.projeto.petitrose.dto.InsumoRequestDTO;
import com.projeto.petitrose.models.Estoque;
import com.projeto.petitrose.models.Insumo;
import com.projeto.petitrose.models.ItemEstoque;
import com.projeto.petitrose.repositories.EstoqueRepository;
import com.projeto.petitrose.repositories.InsumoRepository;
import com.projeto.petitrose.repositories.ItemEstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import jakarta.transaction.Transactional;

@Service
public class InsumoService {

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private ItemEstoqueRepository itemEstoqueRepository;

    @Autowired
    private InsumoRepository insumoRepository;

    @Transactional
    public ItemEstoqueResponseDTO criar(InsumoRequestDTO dto) {
        Insumo insumo = new Insumo();
        insumo.setNome(dto.nome());
        insumo.setValorUnitario(dto.valorUnitario());
        insumo.setCategoria(dto.categoria()); // 🔥 Atribui no cadastro
        insumo.setUnidade(dto.unidade());     // 🔥 Atribui no cadastro
        Insumo insumoSalvo = insumoRepository.save(insumo);

        Estoque estoqueCentral = estoqueRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    Estoque novoEstoque = new Estoque();
                    return estoqueRepository.save(novoEstoque);
                });

        ItemEstoque novoItem = new ItemEstoque();
        novoItem.setEstoque(estoqueCentral);
        novoItem.setInsumo(insumoSalvo);
        novoItem.setQuantidadeAtual(dto.quantidadeAtual() != null ? dto.quantidadeAtual() : 0);
        novoItem.setCapacityMaxima(dto.capacidadeMaxima() != null ? dto.capacidadeMaxima() : 100);
        ItemEstoque itemSalvo = itemEstoqueRepository.save(novoItem);

        float porcentagem = 0;
        if (itemSalvo.getCapacityMaxima() > 0) {
            porcentagem = ((float) itemSalvo.getQuantidadeAtual() / itemSalvo.getCapacityMaxima()) * 100;
        }

        String status = "OK";
        if (porcentagem <= 20) {
            status = "CRÍTICO";
        } else if (porcentagem >= 100) {
            status = "CHEIO";
        }

        // 🔥 Retorno ajustado para os 9 argumentos corretos exigidos pelo DTO
        return new ItemEstoqueResponseDTO(
                itemSalvo.getId(),
                insumoSalvo.getId(),
                insumoSalvo.getNome(),
                itemSalvo.getQuantidadeAtual(),
                itemSalvo.getCapacityMaxima(),
                porcentagem,
                status,
                insumoSalvo.getCategoria(), // 🔥 8º Parâmetro
                insumoSalvo.getUnidade()     // 🔥 9º Parâmetro
        );
    }

    public List<Insumo> listarTodos() {
        return insumoRepository.findAll();
    }

    public Optional<Insumo> buscarPorId(UUID id) {
        return insumoRepository.findById(id);
    }

    public List<Insumo> buscarPorNome(String nome) {
        return insumoRepository.findByNome(nome);
    }

    // 🔥 Método de edição completo e corrigido para salvar no BD
    public Insumo editar(UUID id, Insumo insumoAtualizado, Integer quantidadeAtual, Integer capacidadeMaxima) {
        Insumo insumoExistente = insumoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo não encontrado com o ID: " + id));

        insumoExistente.setNome(insumoAtualizado.getNome());
        insumoExistente.setValorUnitario(insumoAtualizado.getValorUnitario());
        insumoExistente.setCategoria(insumoAtualizado.getCategoria()); // 🔥 Atualiza no BD
        insumoExistente.setUnidade(insumoAtualizado.getUnidade());     // 🔥 Atualiza no BD

        Insumo salvo = insumoRepository.save(insumoExistente);

        Optional<ItemEstoque> itemEstoqueOpt = itemEstoqueRepository.findAll().stream()
                .filter(item -> item.getInsumo().getId().equals(id))
                .findFirst();

        if (itemEstoqueOpt.isPresent()) {
            ItemEstoque itemEstoque = itemEstoqueOpt.get();
            if (quantidadeAtual != null) {
                itemEstoque.setQuantidadeAtual(quantidadeAtual);
            }
            if (capacidadeMaxima != null && capacidadeMaxima > 0) {
                itemEstoque.setCapacityMaxima(capacidadeMaxima);
            }
            itemEstoqueRepository.save(itemEstoque);
        }

        return salvo;
    }

    @Transactional
    public void deletar(UUID id) {
        Insumo insumoExistente = insumoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo não encontrado com o ID: " + id));

        itemEstoqueRepository.deleteByInsumo(insumoExistente);
        insumoRepository.delete(insumoExistente);
    }
}