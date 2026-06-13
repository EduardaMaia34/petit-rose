package com.projeto.petitrose.repositories;

import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.models.StatusPedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID>{
    
    List<Pedido> findByComanda(Comanda comanda);
    List<Pedido> findByStatus(StatusPedido status);
}
