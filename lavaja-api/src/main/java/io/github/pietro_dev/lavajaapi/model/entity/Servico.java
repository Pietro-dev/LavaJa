package io.github.pietro_dev.lavajaapi.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String servico;

    private String descricao;

    private BigDecimal valor;

    private BigDecimal duracao;

    @Column(name = "Data_cadastro")
    private LocalDate dataCadastro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lava_rapido", nullable = false)
    private LavaRapido lavaRapido;


    @PrePersist
    public void prePersist(){
        setDataCadastro(LocalDate.now());
    }


    public Servico() {
        super();
    }

    public Servico(String servico, String descricao, BigDecimal valor, BigDecimal duracao) {
        this.servico = servico;
        this.descricao = descricao;
        this.valor = valor;
        this.duracao = duracao;
    }

    public Servico(Long id, String servico, String descricao, BigDecimal valor, BigDecimal duracao) {
        this.id = id;
        this.servico = servico;
        this.descricao = descricao;
        this.valor = valor;
        this.duracao = duracao;
    }

    public Servico(Long id, String servico, String descricao, BigDecimal valor, BigDecimal duracao, LocalDate dataCadastro) {
        this.id = id;
        this.servico = servico;
        this.descricao = descricao;
        this.valor = valor;
        this.duracao = duracao;
        this.dataCadastro = dataCadastro;
    }
}
