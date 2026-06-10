package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.CategoriaDTO;
import com.projeto.petitrose.models.Categoria;
import com.projeto.petitrose.repositories.CategoriaRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    @Transactional
    public Categoria salvar(CategoriaDTO dto) {
        var categoria = new Categoria();
        BeanUtils.copyProperties(dto, categoria); // Converte o Record DTO para a Entidade
        return repository.save(categoria);
    }

    public List<Categoria> listarTodas() {
        return repository.findAll();
    }

    public Optional<Categoria> buscarPorId(UUID id) {
        return repository.findById(id);
    }

    @Transactional
    public Optional<Categoria> atualizar(UUID id, CategoriaDTO dto) {
        Optional<Categoria> categoriaOpt = repository.findById(id);
        if (categoriaOpt.isPresent()) {
            var categoria = categoriaOpt.get();
            BeanUtils.copyProperties(dto, categoria);
            return Optional.of(repository.save(categoria));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deletar(UUID id) {
        Optional<Categoria> categoria = repository.findById(id);
        if (categoria.isPresent()) {
            repository.delete(categoria.get());
            return true;
        }
        return false;
    }
}