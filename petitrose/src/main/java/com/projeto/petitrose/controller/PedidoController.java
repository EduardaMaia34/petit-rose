package com.projeto.petitrose.controller;

import com.projeto.petitrose.dto.PedidoRequestDTO;
import com.projeto.petitrose.models.ItemPedido;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.models.Produto;
import com.projeto.petitrose.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.UUID;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/comanda/{comandaId}")
    public ResponseEntity<Pedido> criarPedido(@PathVariable UUID comandaId, @RequestBody PedidoRequestDTO dto) {
        Pedido novoPedido = new Pedido();
        
        if (dto.itens() != null) {
            List<ItemPedido> itensPedidos = dto.itens().stream().map(itemDto -> {
                ItemPedido item = new ItemPedido();
                item.setQuantidade(itemDto.quantidade());
                item.setObservacao(itemDto.observacao());
                
                Produto produto = new Produto();
                produto.setId(itemDto.produtoId()); 
                
                item.setProduto(produto);
                return item;
            }).toList();
            
            novoPedido.setItens(itensPedidos);
        }

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
