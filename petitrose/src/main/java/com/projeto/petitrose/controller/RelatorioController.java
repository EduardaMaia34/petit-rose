package com.projeto.petitrose.controller;

import com.projeto.petitrose.dto.RelatorioFluxoCaixaDTO;
import com.projeto.petitrose.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/fluxo-caixa")
    public ResponseEntity<RelatorioFluxoCaixaDTO> obterRelatorioFluxoCaixa(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {

        LocalDateTime fim = (dataFim != null) ? dataFim : LocalDateTime.now();
        // Se dataInicio não for fornecida, assume 30 dias atrás por padrão
        LocalDateTime inicio = (dataInicio != null) ? dataInicio : fim.minusDays(30);

        RelatorioFluxoCaixaDTO relatorio = relatorioService.gerarRelatorioFluxoCaixa(inicio, fim);
        return ResponseEntity.ok(relatorio);
    }
}
