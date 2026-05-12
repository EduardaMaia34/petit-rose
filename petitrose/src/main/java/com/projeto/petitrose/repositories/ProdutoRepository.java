package com.projeto.petitrose.repositories;

import com.projeto.petitrose.models.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {
}