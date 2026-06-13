package com.projeto.petitrose.service;

import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.ItemPedido;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.repositories.ComandaRepository;
import com.projeto.petitrose.repositories.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ComandaRepository comandaRepository;

    @Transactional(readOnly = true)
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    @Transactional
    public Pedido criarPedidoNaComanda(UUID comandaId, Pedido novoPedido) {
        // 1. Busca a comanda ativa associada
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada"));

        // Associa o pedido à comanda
        novoPedido.setComanda(comanda);

        // 2. Amarra o relacionamento bidirecional dos itens
        if (novoPedido.getItens() != null) {
            for (ItemPedido item : novoPedido.getItens()) {
                // 🔥 CORREÇÃO CRÍTICA: REMOVIDA a linha item.setId(UUID.randomUUID());
                // Deixe o campo 'id' nulo para o Hibernate entender que é uma nova inserção!
                item.setPedido(novoPedido);
            }
        }

        // 3. Salva o pedido limpo no banco (o JPA gerará o UUID dos itens automaticamente)
        return pedidoRepository.save(novoPedido);
    }

    @Transactional
    public Pedido editarPedido(UUID pedidoId, Pedido pedidoAtualizado) {
        Pedido pedidoExistente = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Atualiza os dados básicos do cabeçalho do pedido
        pedidoExistente.setStatus(pedidoAtualizado.getStatus());
        pedidoExistente.setValorTotal(pedidoAtualizado.getValorTotal());

        if (pedidoAtualizado.getComanda() != null) {
            pedidoExistente.setComanda(pedidoAtualizado.getComanda());
        }

        // Atualiza a lista de itens de forma segura
        if (pedidoAtualizado.getItens() != null) {
            pedidoExistente.getItens().clear();

            for (ItemPedido item : pedidoAtualizado.getItens()) {
                // 🔥 CORREÇÃO CRÍTICA: Não force UUID.randomUUID() aqui também
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
}