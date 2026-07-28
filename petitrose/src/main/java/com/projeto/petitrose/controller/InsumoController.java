package com.projeto.petitrose.controller;

import com.projeto.petitrose.models.Insumo;
import com.projeto.petitrose.dto.InsumoRequestDTO;        
import com.projeto.petitrose.dto.ItemEstoqueResponseDTO; 
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
    public ResponseEntity<ItemEstoqueResponseDTO> criarInsumo(@RequestBody InsumoRequestDTO dto) {
        ItemEstoqueResponseDTO novoItemEstoque = insumoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoItemEstoque);
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

    // 👑 VERSÃO CORRIGIDA EM com.projeto.petitrose.controller.InsumoController
    @PutMapping("/{id}")
    public ResponseEntity<Insumo> editarInsumo(@PathVariable UUID id, @RequestBody java.util.Map<String, Object> payload) {
        try {
            // 1. Extrai os dados textuais do Insumo do corpo da requisição
            Insumo insumo = new Insumo();
            insumo.setNome((String) payload.get("nome"));
            insumo.setCategoria((String) payload.get("categoria"));
            insumo.setUnidade((String) payload.get("unidade"));
            insumo.setValorUnitario(new java.math.BigDecimal("0.0"));

            // 2. Extrai os dados numéricos de estoque enviados pelo front-end
            Integer quantidadeAtual = payload.get("quantidadeAtual") != null ? Integer.parseInt(payload.get("quantidadeAtual").toString()) : 0;
            Integer capacidadeMaxima = payload.get("capacidadeMaxima") != null ? Integer.parseInt(payload.get("capacidadeMaxima").toString()) : 100;

            // 3. Invoca o serviço passando os parâmetros separados de forma segura
            Insumo insumoEditado = insumoService.editar(id, insumo, quantidadeAtual, capacidadeMaxima);
            return ResponseEntity.ok(insumoEditado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarInsumo(@PathVariable UUID id) {
        try {
            insumoService.deletar(id);
            return ResponseEntity.noContent().build(); 
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}