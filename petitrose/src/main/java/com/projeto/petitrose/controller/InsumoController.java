package com.projeto.petitrose.controller;

import com.projeto.petitrose.models.Insumo;
import com.projeto.petitrose.service.InsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/insumos")
@CrossOrigin(origins = "*")
public class InsumoController {

    @Autowired
    private InsumoService insumoService;


    @PostMapping
    public ResponseEntity<Insumo> criarInsumo(@RequestBody Insumo insumo) {
        Insumo novoInsumo = insumoService.criar(insumo);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoInsumo);
    }

    @GetMapping
    public ResponseEntity<List<Insumo>> listarInsumos(@RequestParam(required = false) String nome) {
        if (nome != null && !nome.trim().isEmpty()) {
            return ResponseEntity.ok(insumoService.buscarPorNome(nome));
        }
        return ResponseEntity.ok(insumoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Insumo> buscarPorId(@PathVariable UUID id) {
        return insumoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Insumo> editarInsumo(@PathVariable UUID id, @RequestBody Insumo insumo) {
        try {
            Insumo insumoEditado = insumoService.editar(id, insumo);
            return ResponseEntity.ok(insumoEditado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarInsumo(@PathVariable UUID id) {
        try {
            insumoService.deletar(id);
            return ResponseEntity.noContent().build(); // Retorna Status 204 (Sucesso sem corpo de resposta)
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}