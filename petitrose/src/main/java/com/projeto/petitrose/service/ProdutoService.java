package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.ProdutoDTO;
import com.projeto.petitrose.models.Categoria;
import com.projeto.petitrose.models.Produto;
import com.projeto.petitrose.repositories.CategoriaRepository;
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
    private ProdutoRepository repository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Transactional
    public Produto salvar(ProdutoDTO dto) {
        var produto = new Produto();
        BeanUtils.copyProperties(dto, produto, "categoriaId");

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com o ID fornecido."));

        produto.setCategoria(categoria);
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

            BeanUtils.copyProperties(dto, produto, "id", "categoriaId");

            Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com o ID fornecido."));

            produto.setCategoria(categoria);
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