package io.github.pietro_dev.lavajaapi.rest.servicos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ServicoResponseDTO {
    private Long id;
    private String servico;
    private String descricao;
    private BigDecimal valor;
    private BigDecimal duracao;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;

    public ServicoResponseDTO() {
        super();
    }

    public ServicoResponseDTO(Long id, String servico, String descricao, BigDecimal valor,
                              BigDecimal duracao, LocalDate dataCadastro) {
        this.id = id;
        this.servico = servico;
        this.descricao = descricao;
        this.valor = valor;
        this.duracao = duracao;
        this.dataCadastro = dataCadastro;
    }
}
