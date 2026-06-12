package com.projeto.petitrose.service;

import com.projeto.petitrose.models.Comanda;
import com.projeto.petitrose.models.ItemPedido;
import com.projeto.petitrose.models.Pedido;
import com.projeto.petitrose.models.Usuario;
import com.projeto.petitrose.repositories.ComandaRepository;
import com.projeto.petitrose.repositories.PedidoRepository;
import com.projeto.petitrose.repositories.UsuarioRepository; // 🔥 Import necessário
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

    @Autowired
    private UsuarioRepository usuarioRepository; // 🔥 Injeção para buscar o cliente real

    @Transactional
    public Pedido criarPedidoNaComanda(UUID comandaId, Pedido novoPedido) {
        // 1. Busca a comanda ativa
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada"));
        novoPedido.setComanda(comanda);

        // 🔥 2. CORREÇÃO CRÍTICA: Busca o Cliente Real gerenciado pelo JPA para evitar o erro Transient
        if (novoPedido.getCliente() != null && novoPedido.getCliente().getId() != null) {
            Usuario clienteGerenciado = usuarioRepository.findById(novoPedido.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID fornecido"));
            novoPedido.setCliente(clienteGerenciado);
        } else {
            throw new RuntimeException("É obrigatório associar um cliente válido a este pedido.");
        }

        // 3. Amarra o relacionamento bidirecional dos itens
        if (novoPedido.getItens() != null) {
            for (ItemPedido item : novoPedido.getItens()) {
                item.setPedido(novoPedido);
            }
        }

        // 4. Salva o pedido perfeitamente
        return pedidoRepository.save(novoPedido);
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

        // 🔥 5. CORREÇÃO CRÍTICA NA EDIÇÃO: Reassocia o cliente gerenciado se ele mudar
        if (pedidoAtualizado.getCliente() != null && pedidoAtualizado.getCliente().getId() != null) {
            Usuario clienteGerenciado = usuarioRepository.findById(pedidoAtualizado.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID fornecido"));
            pedidoExistente.setCliente(clienteGerenciado);
        }

        // Lista de itens mudou
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
}