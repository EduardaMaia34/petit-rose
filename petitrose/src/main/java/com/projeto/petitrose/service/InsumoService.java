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

        
        return new ItemEstoqueResponseDTO(
            itemSalvo.getId(),         
            insumoSalvo.getId(),      
            insumoSalvo.getNome(),
            itemSalvo.getQuantidadeAtual(),
            itemSalvo.getCapacityMaxima(),
            porcentagem,
            status
        );
    }

    // listar todos
    public List<Insumo> listarTodos() {
        return insumoRepository.findAll();
    }

    // buscar por id
    public Optional<Insumo> buscarPorId(UUID id) {
        return insumoRepository.findById(id);
    }

    // buscar por nome
    public List<Insumo> buscarPorNome(String nome) {
        return insumoRepository.findByNome(nome);
    }

    // editar Insumo
    public Insumo editar(UUID id, Insumo insumoAtualizado) {
        Insumo insumoExistente = insumoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo não encontrado com o ID: " + id));
        
        insumoExistente.setNome(insumoAtualizado.getNome());
        insumoExistente.setValorUnitario(insumoAtualizado.getValorUnitario());

        return insumoRepository.save(insumoExistente);
    }

    // deletar Insumo
    @Transactional
    public void deletar(UUID id) {
        Insumo insumoExistente = insumoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo não encontrado com o ID: " + id));
        
        itemEstoqueRepository.deleteByInsumo(insumoExistente);
        insumoRepository.delete(insumoExistente);
    }
}