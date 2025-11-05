package io.github.pietro_dev.lavajaapi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.ser.std.UUIDSerializer;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Agendamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lava_rapido", nullable = false)
    private LavaRapido lavaRapido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico", nullable = false)
    private Servico servico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario", nullable = false)
    private Usuario usuario;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime horaInicio;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime horaFim;
    private Integer duracaoMinutos;
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    private Status status = Status.AGENDADO;

    @Column(nullable = false, updatable = false)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCriacao;

    @PrePersist
    public void prePersist(){
        setDataCriacao(LocalDate.now());
    }
}
