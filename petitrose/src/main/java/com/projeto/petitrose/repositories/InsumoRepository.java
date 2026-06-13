package com.projeto.petitrose.repositories;

import com.projeto.petitrose.models.Insumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, UUID> {
    List<Insumo> findByNome(String nome);
}