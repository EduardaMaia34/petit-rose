package com.projeto.petitrose.controller;

import com.projeto.petitrose.dto.ItemEstoqueResponseDTO;
import com.projeto.petitrose.models.ItemEstoque;
import com.projeto.petitrose.service.EstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin(origins = "*")
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    // Traz a lista completa de insumos ligados ao estoque e suas respectivas quantidades
    @GetMapping
    public ResponseEntity<List<ItemEstoqueResponseDTO>> listarEstoque() {
        return ResponseEntity.ok(estoqueService.listarItensEstoque());
    }

    // Atualiza a quantidade atual de um insumo específico no estoque
    @PutMapping("/item/{id}")
    public ResponseEntity<ItemEstoqueResponseDTO> editarQuantidade(
            @PathVariable UUID id, 
            @RequestBody ItemEstoque itemEstoque) {
        try {
            ItemEstoqueResponseDTO atualizado = estoqueService.editarQuantidade(id, itemEstoque);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}