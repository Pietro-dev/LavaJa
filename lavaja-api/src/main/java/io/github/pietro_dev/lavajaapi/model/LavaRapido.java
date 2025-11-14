package io.github.pietro_dev.lavajaapi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.rest.lavarapidos.LavaRapidoFormRequest;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

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
    private UsuarioRole role;

    @Column(name="data_cadastro")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;

    @OneToMany(mappedBy = "lavaRapido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Servico> servicos;

    @PrePersist
    public void prePersist(){
        setDataCadastro(LocalDate.now());
    }

    public LavaRapido(){
        super();
    }

    public LavaRapido(Long id, String razaoSocial, String cnpj, String endereco, String telefone, String email, String senha, LocalDate dataCadastro) {
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

    public LavaRapido(LavaRapidoFormRequest formRequest) {
        this.razaoSocial = formRequest.getRazaoSocial();
        this.cnpj = formRequest.getCnpj();
        this.endereco = formRequest.getEndereco();
        this.telefone = formRequest.getTelefone();
        this.email = formRequest.getEmail();
        this.senha = formRequest.getSenha();
        this.role = UsuarioRole.LAVARAPIDO;
    }

}
