package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ProdutoDTO;
import com.projeto.petitrose.models.Produto;
import com.projeto.petitrose.repositories.ProdutoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProdutoService {

    @Autowired
    ProdutoRepository repository;

    @Transactional
    public Produto salvar(ProdutoDTO dto) {
        var produto = new Produto();
        BeanUtils.copyProperties(dto, produto); // Converte DTO para Model
        return repository.save(produto);
    }

    public List<Produto> listarTodos() {
        return repository.findAll();
    }

    public Optional<Produto> buscarPorId(UUID id) {
        return repository.findById(id);
    }

    @Transactional
    public Optional<Produto> atualizar(UUID id, ProdutoDTO dto) {
        Optional<Produto> produtoOpt = repository.findById(id);
        if (produtoOpt.isPresent()) {
            var produto = produtoOpt.get();
            BeanUtils.copyProperties(dto, produto);
            return Optional.of(repository.save(produto));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deletar(UUID id) {
        Optional<Produto> produto = repository.findById(id);
        if (produto.isPresent()) {
            repository.delete(produto.get());
            return true;
        }
        return false;
    }
}