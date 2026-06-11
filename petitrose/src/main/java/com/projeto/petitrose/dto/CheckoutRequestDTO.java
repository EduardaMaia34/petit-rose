package com.projeto.petitrose.dto;

import java.util.List;
import java.util.UUID;
import jakarta.validation.constraints.NotEmpty;

public record CheckoutRequestDTO(
    @NotEmpty(message = "É necessário informar ao menos uma comanda para o pagamento.")
    List<UUID> comandaIds
) {}