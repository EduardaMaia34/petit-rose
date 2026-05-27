package com.projeto.petitrose.repositories;

import com.projeto.petitrose.models.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, UUID> {

    Optional<Comanda> findById(UUID id);
    List<Comanda> findByAberta();

}
