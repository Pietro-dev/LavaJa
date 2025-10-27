package io.github.pietro_dev.lavajaapi.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LavaRapido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String razaoSocial;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String email;
    private String senha;

    @Column(name="data_cadastro")
    private String dataCadastro;

    public LavaRapido(){
        super();
    }

    public LavaRapido(Long id, String razaoSocial, String cnpj, String endereco, String telefone, String email, String senha, String dataCadastro) {
        this.id = id;
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
    }

    public LavaRapido(String razaoSocial, String cnpj, String endereco, String telefone, String email, String senha) {
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
    }
}
