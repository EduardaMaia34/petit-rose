package com.projeto.petitrose.dto;

<<<<<<< HEAD
=======
import com.projeto.petitrose.models.MetodoPagamento;
>>>>>>> origin/dev-gustavo
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ComandaResponseDTO(
        UUID id,
        Integer numeroMesa,
        LocalDateTime dataAbertura,
        Boolean aberta,
<<<<<<< HEAD
        BigDecimal valorTotalComanda
=======
        BigDecimal valorTotalComanda,
        MetodoPagamento metodoPagamento
>>>>>>> origin/dev-gustavo
) {}