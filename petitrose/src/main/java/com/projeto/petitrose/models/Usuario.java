package com.projeto.petitrose.models;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data //getters e setters
@Table(name="Usuario")
public class Usuario implements Serializable{
    private static final long serialVersionUID = 1L; //camada extra de seguranca
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable=false, length = 100)
    private String nome;
    @Column(nullable=false, unique=true)
    private String email;
    @Column(nullable=false)
    private String senha;

    private Boolean gerente = false; //valor padrao


}
