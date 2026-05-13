package com.projeto.petitrose.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

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

            // Retorna um JSON com o nome do arquivo para o React
            Map<String, String> resposta = new HashMap<>();
            resposta.put("nomeArquivo", nomeArquivoUnico);
            resposta.put("url", "http://localhost:8080/uploads/" + nomeArquivoUnico);

            return ResponseEntity.ok(resposta);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}