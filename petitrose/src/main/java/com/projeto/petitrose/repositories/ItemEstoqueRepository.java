package com.projeto.petitrose.repositories;

import com.projeto.petitrose.models.ItemEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface ItemEstoqueRepository extends JpaRepository<ItemEstoque, UUID> {
    
    Optional<ItemEstoque> findByInsumoId(UUID insumoId);
}