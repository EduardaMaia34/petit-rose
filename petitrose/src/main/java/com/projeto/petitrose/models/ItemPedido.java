package com.projeto.petitrose.models;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="ItemPedido")
public class ItemPedido implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // 🔥 ALTERE ESTA LINHA: Obriga o Hibernate a gerar o UUID antes do persist()
    private UUID id;

    @Column(nullable=false)
    private BigDecimal precoUnitario;

    @Column(nullable=false)
    private Integer quantidade = 1;

    @Column(length=100)
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnoreProperties("itens")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;
}