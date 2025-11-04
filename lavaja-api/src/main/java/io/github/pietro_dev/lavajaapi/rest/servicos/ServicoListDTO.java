package io.github.pietro_dev.lavajaapi.rest.servicos;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ServicoListDTO {
    private Long id;
    private String servico;
    private String descricao;
    private BigDecimal valor;
    private BigDecimal duracao;
    private LocalDate dataCadastro;
    private Long lavaRapidoId;
    private String lavaRapidoNome;

    public ServicoListDTO(Long id, String servico, String descricao, BigDecimal valor,
                          BigDecimal duracao, LocalDate dataCadastro,
                          Long lavaRapidoId, String lavaRapidoNome) {
        this.id = id;
        this.servico = servico;
        this.descricao = descricao;
        this.valor = valor;
        this.duracao = duracao;
        this.dataCadastro = dataCadastro;
        this.lavaRapidoId = lavaRapidoId;
        this.lavaRapidoNome = lavaRapidoNome;
    }
}
