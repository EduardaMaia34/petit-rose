package com.projeto.petitrose.controller;

import com.projeto.petitrose.dto.CatalogoResponseDTO;
import com.projeto.petitrose.service.CatalogoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/catalogo")
public class CatalogoController {

    @Autowired
    private CatalogoService catalogoService;

    @GetMapping
    public ResponseEntity<List<CatalogoResponseDTO>> obterCatalogo() {
        List<CatalogoResponseDTO> catalogo = catalogoService.listarProdutosNoCatalogo();
        return ResponseEntity.ok(catalogo);
    }
}