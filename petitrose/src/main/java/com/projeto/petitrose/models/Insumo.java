package com.projeto.petitrose.models;

import java.math.BigDecimal;
import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "insumos")
@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) 
    private UUID id;

    @Column(nullable = false, length = 150) 
    private String nome;

    @Column(name = "valor_unitario", nullable = false)
    private BigDecimal valorUnitario;
}