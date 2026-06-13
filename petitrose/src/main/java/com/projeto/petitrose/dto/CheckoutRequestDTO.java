package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.MetodoPagamento;
import java.util.List;
import java.util.UUID;

public record CheckoutRequestDTO(
    List<UUID> comandaIds,
    MetodoPagamento metodoPagamento
) {}