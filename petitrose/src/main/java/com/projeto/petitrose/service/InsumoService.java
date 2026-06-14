package com.projeto.petitrose.service;

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
    public Insumo criar(Insumo insumo) {
        insumo.setId(null);
        Insumo insumoSalvo = insumoRepository.save(insumo);

        
        Estoque estoqueCentral = estoqueRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    Estoque novoEstoque = new Estoque();
                    return estoqueRepository.save(novoEstoque);
                });

        // quando insumo eh criado, sera adicionado ao estoque com quantidade 0
        ItemEstoque novoItem = new ItemEstoque();
        novoItem.setEstoque(estoqueCentral);
        novoItem.setInsumo(insumoSalvo);
        novoItem.setQuantidadeAtual(0);
        novoItem.setCapacityMaxima(100);

        itemEstoqueRepository.save(novoItem);

        return insumoSalvo;
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