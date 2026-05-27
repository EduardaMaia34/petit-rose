package com.projeto.petitrose.service;

import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.repositories.ComandaRepository;
import com.projeto.petitrose.repositories.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private ComandaRepository comandaRepository;

    public Pedido criarPedidoNaComanda(UUID comandaId, Pedido novoPedido){

        // buscar comanda
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada"));

        // associa pedido a comanda
        novoPedido.setComanda(comanda);
        // salva pedido
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

        //lista de itens mudou
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
}
