package com.projeto.petitrose.controller;

import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*") // Garante o acesso do frontend em React sem erros de CORS
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {
        List<Pedido> pedidos = pedidoService.listarTodos();
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/comanda/{comandaId}")
    public ResponseEntity<Pedido> criarPedido(@PathVariable UUID comandaId, @RequestBody Pedido novoPedido) {
        Pedido pedidoCriado = pedidoService.criarPedidoNaComanda(comandaId, novoPedido);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCriado);
    }

    @PutMapping("/{pedidoId}")
    public ResponseEntity<Pedido> editarPedido(@PathVariable UUID pedidoId, @RequestBody Pedido pedidoAtualizado) {
        Pedido pedidoAlterado = pedidoService.editarPedido(pedidoId, pedidoAtualizado);
        return ResponseEntity.ok(pedidoAlterado);
    }

    @DeleteMapping("/{pedidoId}")
    public ResponseEntity<Void> deletarPedido(@PathVariable UUID pedidoId) {
        pedidoService.deletarPedido(pedidoId);
        return ResponseEntity.noContent().build();
    }
}