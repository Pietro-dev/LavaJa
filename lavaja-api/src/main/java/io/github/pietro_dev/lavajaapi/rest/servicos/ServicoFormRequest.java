package io.github.pietro_dev.lavajaapi.rest.servicos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Servico;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ServicoFormRequest {
    private Long id;
    private String servico;
    private String descricao;
    private BigDecimal valor;
    private BigDecimal duracao;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;
    private Long lavaRapidoId;

    public ServicoFormRequest() {
        super();
    }

    public ServicoFormRequest(Long id, String servico, String descricao, BigDecimal valor, BigDecimal duracao, LocalDate dataCadastro, Long lavaRapidoId) {
        super();
        this.id = id;
        this.servico = servico;
        this.descricao = descricao;
        this.valor = valor;
        this.duracao = duracao;
        this.dataCadastro = dataCadastro;
        this.lavaRapidoId = lavaRapidoId;
    }

    public Servico toModel(){
        return new Servico(id, servico, descricao, valor, duracao, dataCadastro);
    }

    public static ServicoFormRequest fromModel(Servico servico){
        Long lavaRapidoId = servico.getLavaRapido() != null ? servico.getLavaRapido().getId() : null;
        return new ServicoFormRequest(
                servico.getId(),
                servico.getServico(),
                servico.getDescricao(),
                servico.getValor(),
                servico.getDuracao(),
                servico.getDataCadastro(),
                lavaRapidoId);
    }
}
