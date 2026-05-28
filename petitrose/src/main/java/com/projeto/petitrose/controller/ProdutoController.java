package com.projeto.petitrose.controller;

import com.projeto.petitrose.dto.ProdutoDTO;
import com.projeto.petitrose.models.Produto;
import com.projeto.petitrose.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService service;

    private final String DIRETORIO_UPLOAD = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImagem(@RequestParam("imagem") MultipartFile arquivo) {
        try {
            Path caminhoDiretorio = Paths.get(DIRETORIO_UPLOAD);
            if (!Files.exists(caminhoDiretorio)) {
                Files.createDirectories(caminhoDiretorio);
            }

            String nomeArquivoUnico = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
            Path caminhoCompleto = caminhoDiretorio.resolve(nomeArquivoUnico);
            Files.copy(arquivo.getInputStream(), caminhoCompleto);

            Map<String, String> resposta = new HashMap<>();
            resposta.put("nomeArquivo", nomeArquivoUnico);
            resposta.put("url", "http://localhost:8080/uploads/" + nomeArquivoUnico);

            return ResponseEntity.ok(resposta);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Produto> save(@RequestBody @Valid ProdutoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<Produto>> getAll() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOne(@PathVariable UUID id) {
        return service.buscarPorId(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable UUID id, @RequestBody @Valid ProdutoDTO dto) {
        return service.atualizar(id, dto)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado para atualizar."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable UUID id) {
        return service.deletar(id)
                ? ResponseEntity.ok("Deletado com sucesso.")
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
    }
}