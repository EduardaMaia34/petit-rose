package com.projeto.petitrose.controller;

import com.projeto.petitrose.dto.TransacaoRequestDTO;
import com.projeto.petitrose.dto.TransacaoResponseDTO;
import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.TipoTransacao;
import com.projeto.petitrose.service.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

    @Autowired
    private TransacaoService transacaoService;

    @PostMapping
    public ResponseEntity<TransacaoResponseDTO> cadastrar(@RequestBody @Valid TransacaoRequestDTO dto) {
        TransacaoResponseDTO response = transacaoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TransacaoResponseDTO>> listar(
            @RequestParam(required = false) TipoTransacao tipo,
            @RequestParam(required = false) MetodoPagamento metodoPagamento,
            @RequestParam(required = false) String item,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        
        List<TransacaoResponseDTO> response = transacaoService.listarComFiltros(tipo, metodoPagamento, item, dataInicio, dataFim);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        transacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
