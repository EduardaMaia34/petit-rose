package com.projeto.petitrose.controller;

import com.projeto.petitrose.dto.CheckoutRequestDTO;
import com.projeto.petitrose.dto.CheckoutResponseDTO;
import com.projeto.petitrose.dto.ComandaRequestDTO;
import com.projeto.petitrose.dto.ComandaResponseDTO;
import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.service.ComandaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comandas")
public class ComandaController {

    @Autowired
    private ComandaService comandaService;


    @PostMapping
    public ResponseEntity<ComandaResponseDTO> abrirComanda(@RequestBody @Valid ComandaRequestDTO dto) {
        ComandaResponseDTO novaComanda = comandaService.abrirNovaComanda(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaComanda);
    }


    @GetMapping("/ativas")
    public ResponseEntity<List<ComandaResponseDTO>> listarAtivas() {
        List<ComandaResponseDTO> comandasAtivas = comandaService.buscarComandasAtivas();
        return ResponseEntity.ok(comandasAtivas);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ComandaResponseDTO> buscarPorId(@PathVariable UUID id) {
        ComandaResponseDTO comanda = comandaService.buscarPorId(id);
        return ResponseEntity.ok(comanda);
    }

    @PutMapping("/{id}/fechar")
    public ResponseEntity<Void> fecharComanda(
            @PathVariable UUID id,
            @RequestParam MetodoPagamento metodoPagamento) {
        comandaService.fecharComanda(id, metodoPagamento);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDTO> efetuarCheckout(@RequestBody @Valid CheckoutRequestDTO request) {
        CheckoutResponseDTO response = comandaService.processarPagamento(request);
        return ResponseEntity.ok(response);
    }
}