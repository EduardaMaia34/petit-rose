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
@RequestMapping("/produtos")
@CrossOrigin(origins = "*") // Garante que o React consiga acessar sem problemas de CORS
public class ProdutoController {

    @Autowired
    private ProdutoService service;

    // Modificado para usar o caminho relativo seguro baseado na raiz do projeto
    private final String DIRETORIO_UPLOAD = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImagem(@RequestParam("imagem") MultipartFile arquivo) {
        // Validação preventiva: Se o arquivo veio vazio, mata a requisição com 400 antes de travar
        if (arquivo == null || arquivo.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: O arquivo enviado está vazio.");
        }

        try {
            // Define o caminho absoluto baseado no diretório de execução do projeto
            Path caminhoDiretorio = Paths.get(System.getProperty("user.dir"), DIRETORIO_UPLOAD);
            if (!Files.exists(caminhoDiretorio)) {
                Files.createDirectories(caminhoDiretorio);
            }

            String nomeArquivoUnico = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
            Path caminhoCompleto = caminhoDiretorio.resolve(nomeArquivoUnico);
            
            // CORREÇÃO: transferTo delega a gravação direto ao SO, evitando travar a JVM no Linux
            arquivo.transferTo(caminhoCompleto.toFile());

            Map<String, String> resposta = new HashMap<>();
            resposta.put("nomeArquivo", nomeArquivoUnico);
            resposta.put("url", "http://localhost:8080/uploads/" + nomeArquivoUnico);

            System.out.println("📸 Imagem salva com sucesso em: " + caminhoCompleto);
            return ResponseEntity.ok(resposta);
            
        } catch (IOException e) {
            // CORREÇÃO: Printa o erro exato no console em vez de esconder no catch vazio
            System.err.println("❌ Erro ao processar o upload de imagem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao salvar o arquivo: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody @Valid ProdutoDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Produto>> getAll() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable UUID id) {
        return service.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody @Valid ProdutoDTO dto) {
        try {
            return service.atualizar(id, dto)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado para atualizar."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        return service.deletar(id)
                ? ResponseEntity.ok("Deletado com sucesso.")
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
    }
}