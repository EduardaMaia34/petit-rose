package com.projeto.petitrose.dto;

import com.projeto.petitrose.models.MetodoPagamento;
import com.projeto.petitrose.models.TipoTransacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransacaoRequestDTO(
        @NotNull(message = "O tipo da transação é obrigatório")
        TipoTransacao tipo,

        @NotBlank(message = "O item é obrigatório")
        String item,

        @NotNull(message = "O valor é obrigatório")
        @Positive(message = "O valor deve ser positivo")
        BigDecimal valor,

        LocalDateTime data,

        @NotNull(message = "O método de pagamento é obrigatório")
        MetodoPagamento metodoPagamento,
        Integer quantidade
) {}
