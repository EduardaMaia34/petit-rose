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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public Pedido criarPedidoNaComanda(UUID comandaId, Pedido novoPedido) {
        
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada com o ID fornecido: " + comandaId));
        
        novoPedido.setComanda(comanda);
        novoPedido.setDataCriacao(LocalDateTime.now());
        novoPedido.setStatus(StatusPedido.PENDENTE);

        novoPedido.setValorTotal(BigDecimal.ZERO); 

        BigDecimal totalPedido = BigDecimal.ZERO;

        List<ItemPedido> itensParaProcessar = novoPedido.getItens();
        novoPedido.setItens(null);

        Pedido pedidoSalvo = pedidoRepository.save(novoPedido);

        if (itensParaProcessar != null && !itensParaProcessar.isEmpty()) {
            for (ItemPedido item : itensParaProcessar) {

                item.setId(null); 

                Produto produtoReal = produtoRepository.findById(item.getProduto().getId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado no catálogo"));

                item.setProduto(produtoReal);
                item.setPrecoUnitario(BigDecimal.valueOf(produtoReal.getValor())); 
                item.setPedido(pedidoSalvo); 

                BigDecimal quantidadeBigDecimal = new BigDecimal(item.getQuantidade());
                BigDecimal subtotalItem = item.getPrecoUnitario().multiply(quantidadeBigDecimal);

                totalPedido = totalPedido.add(subtotalItem);
            }
            pedidoSalvo.setItens(itensParaProcessar);
        }

        pedidoSalvo.setValorTotal(totalPedido);

        BigDecimal valorAtualComanda = comanda.getValorTotal() != null ? comanda.getValorTotal() : BigDecimal.ZERO;
        comanda.setValorTotal(valorAtualComanda.add(totalPedido));
        comandaRepository.save(comanda);

        return pedidoRepository.save(pedidoSalvo);
    }

    @Transactional
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

            for (ItemPedido item : pedidoAtualizado.getItens()) {
                item.setPedido(pedidoExistente);
            }

            pedidoExistente.getItens().addAll(pedidoAtualizado.getItens());
        }

        return pedidoRepository.save(pedidoExistente);
    }

    @Transactional
    public void deletarPedido(UUID pedidoId) {
        if (!pedidoRepository.existsById(pedidoId)) {
            throw new RuntimeException("Pedido não encontrado para exclusão");
        }
        pedidoRepository.deleteById(pedidoId);
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Pedido buscarPorId(UUID pedidoId) {
        return pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com o ID: " + pedidoId));
    }
}