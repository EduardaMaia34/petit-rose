package com.projeto.petitrose.service;

import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.ItemPedido;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.models.Produto;
import com.projeto.petitrose.models.StatusPedido;
import com.projeto.petitrose.repositories.ComandaRepository;
import com.projeto.petitrose.repositories.PedidoRepository;
import com.projeto.petitrose.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; 
import java.util.UUID;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private ComandaRepository comandaRepository;
    
    @Autowired
    private ProdutoRepository produtoRepository;

    public Pedido criarPedidoNaComanda(UUID comandaId, Pedido novoPedido){
        // buscar comanda
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada"));
        novoPedido.setComanda(comanda);

        //valores padroes
        novoPedido.setDataCriacao(LocalDateTime.now());
        novoPedido.setStatus(StatusPedido.PENDENTE);
        
        BigDecimal totalPedido = BigDecimal.ZERO;

        // processar e calcular cada item do pedido
        if (novoPedido.getItens() != null && !novoPedido.getItens().isEmpty()) {
            for (ItemPedido item : novoPedido.getItens()) {
                
                if (item.getId() == null) {
                    item.setId(UUID.randomUUID());
                }
                
                Produto produtoReal = produtoRepository.findById(item.getProduto().getId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado no catálogo"));
                
                item.setProduto(produtoReal);
                item.setPrecoUnitario(BigDecimal.valueOf(produtoReal.getValor())); 
                item.setPedido(novoPedido);
                
                BigDecimal quantidadeBigDecimal = new BigDecimal(item.getQuantidade());
                BigDecimal subtotalItem = item.getPrecoUnitario().multiply(quantidadeBigDecimal);
                
                totalPedido = totalPedido.add(subtotalItem);
            }
        }

        novoPedido.setValorTotal(totalPedido);

        return pedidoRepository.save(novoPedido);
    }

    public Pedido editarPedido(UUID pedidoId, Pedido pedidoAtualizado) {
        Pedido pedidoExistente = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedidoExistente.setStatus(pedidoAtualizado.getStatus());
        pedidoExistente.setValorTotal(pedidoAtualizado.getValorTotal());

        if (pedidoAtualizado.getComanda() != null) {
            pedidoExistente.setComanda(pedidoAtualizado.getComanda());
        }

        if (pedidoAtualizado.getItens() != null) {
            pedidoExistente.getItens().clear();
            pedidoExistente.getItens().addAll(pedidoAtualizado.getItens());
        }

        return pedidoRepository.save(pedidoExistente);
    }

    public void deletarPedido(UUID pedidoId) {
        if (!pedidoRepository.existsById(pedidoId)) {
            throw new RuntimeException("Pedido não encontrado para exclusão");
        }
        pedidoRepository.deleteById(pedidoId);
    }


    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    // GET por ID: Busca um pedido específico pelo UUID dele
    public Pedido buscarPorId(UUID pedidoId) {
        return pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com o ID: " + pedidoId));
    }
}