package io.github.pietro_dev.lavajaapi.rest.lavarapidos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LavaRapidoFormRequest {
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
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;

    public LavaRapidoFormRequest() {
        super();
    }

    public LavaRapidoFormRequest(Long id, String razaoSocial, String cnpj, String endereco, String telefone, String email, String senha, LocalDate dataCadastro) {
        this.id = id;
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
    }

    public LavaRapido toModel(){
        return new LavaRapido(id, razaoSocial, cnpj, endereco,telefone, email, senha, dataCadastro);
    }

    public static LavaRapidoFormRequest fromModel(LavaRapido lavaRapido){
        return new LavaRapidoFormRequest(lavaRapido.getId(), lavaRapido.getRazaoSocial(), lavaRapido.getCnpj(), lavaRapido.getEndereco(), lavaRapido.getTelefone(), lavaRapido.getEmail(), lavaRapido.getSenha(), lavaRapido.getDataCadastro());
    }
}
