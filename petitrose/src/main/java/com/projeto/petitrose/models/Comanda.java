package com.projeto.petitrose.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Comanda")
public class Comanda implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private Integer numeroMesa;

    @Column(nullable = false)
    private LocalDateTime dataAbertura = LocalDateTime.now();

    private LocalDateTime dataFechamento;

    @Column(nullable = false)
    private Boolean aberta = true;

    //uma comanda pode ter vários pedidos
    @OneToMany(mappedBy = "comanda", cascade = CascadeType.ALL)
    private List<Pedido> pedidos;
}
