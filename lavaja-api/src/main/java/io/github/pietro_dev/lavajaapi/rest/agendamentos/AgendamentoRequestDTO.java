package io.github.pietro_dev.lavajaapi.rest.agendamentos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AgendamentoRequestDTO {
    private Long servicoId;
    private Long usuarioId;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime inicio;
}
