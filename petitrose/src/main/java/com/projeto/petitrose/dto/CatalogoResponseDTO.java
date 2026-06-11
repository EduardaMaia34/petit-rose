package com.projeto.petitrose.dto;

import java.util.UUID;

public record CatalogoResponseDTO  (
    UUID id,
    String nome, 
    float valor,
    String descricao, 
    String imagemUrl, 
    String nomeCategoria

){}
