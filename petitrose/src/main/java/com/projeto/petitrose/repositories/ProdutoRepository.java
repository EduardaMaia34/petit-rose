package com.projeto.petitrose.repositories;

import com.projeto.petitrose.models.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {
    
    List<Produto> findByCatalogoAtivoTrue();
}