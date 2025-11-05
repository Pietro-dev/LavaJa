package io.github.pietro_dev.lavajaapi.rest.agendamentos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AgendamentoAtualizarStatusDTO {
    private Long servicoId;
    private Long usuarioId;
    private Status status;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime inicio;
}
