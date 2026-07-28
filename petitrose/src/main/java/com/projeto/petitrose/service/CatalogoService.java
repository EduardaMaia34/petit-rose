package com.projeto.petitrose.service;

import com.projeto.petitrose.dto.CatalogoResponseDTO;
import com.projeto.petitrose.models.Produto;
import com.projeto.petitrose.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CatalogoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // retorna produtos que estao no catalogo atual
    public List<CatalogoResponseDTO> listarProdutosNoCatalogo() {
        List<Produto> produtosAtivos = produtoRepository.findByCatalogoAtivoTrue();

        return produtosAtivos.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // entidade para produto dto
    private CatalogoResponseDTO converterParaDTO(Produto produto) {
        // Tratamento simples caso a categoria esteja nula por algum motivo
        String categoriaNome = (produto.getCategoria() != null) ? produto.getCategoria().getNome() : "Sem Categoria";

        return new CatalogoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getValor(),
                produto.getDescricao(),
                produto.getImagemUrl(),
                categoriaNome
        );
    }
}