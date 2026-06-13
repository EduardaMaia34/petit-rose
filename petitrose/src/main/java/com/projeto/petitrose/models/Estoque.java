package com.projeto.petitrose.models;

import java.util.UUID;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "estoques")
@Data
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String nome = "Estoque Central Petit Rose";

    @OneToMany(mappedBy = "estoque", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemEstoque> itens;
}