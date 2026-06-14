package com.projeto.petitrose.models;

import java.util.UUID;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "itens_estoque")
@Data
@NoArgsConstructor
public class ItemEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    
    @ManyToOne
    @JoinColumn(name = "estoque_id", nullable = false)
    private Estoque estoque;

    
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @Column(name = "quantidade_atual", nullable = false)
    private int quantidadeAtual;

    @Column(name = "capacidade_maxima", nullable = false)
    private int capacityMaxima = 100;
}