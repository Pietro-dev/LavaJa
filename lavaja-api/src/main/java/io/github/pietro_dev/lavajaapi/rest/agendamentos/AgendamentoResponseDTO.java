package io.github.pietro_dev.lavajaapi.rest.agendamentos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.Agendamento;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AgendamentoResponseDTO {
    private Long id;
    private Long servicoId;
    private Long lavaRapidoId;
    private Long usuarioId;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime inicio;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime fim;
    private Integer duracaoMinutos;
    private BigDecimal valor;
    private String status;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCriacao;

    public AgendamentoResponseDTO(Agendamento ag) {
        this.id = ag.getId();
        this.servicoId = ag.getServico() != null ? ag.getServico().getId() : null;
        this.lavaRapidoId = ag.getLavaRapido() != null ? ag.getLavaRapido().getId() : null;
        this.usuarioId = ag.getUsuario() != null ? ag.getUsuario().getId() : null;
        this.inicio = ag.getHoraInicio();
        this.fim = ag.getHoraFim();
        this.duracaoMinutos = ag.getDuracaoMinutos();
        this.valor = ag.getValor();
        this.status = ag.getStatus() != null ? ag.getStatus().name() : null;
        this.dataCriacao = ag.getDataCriacao();
    }
}