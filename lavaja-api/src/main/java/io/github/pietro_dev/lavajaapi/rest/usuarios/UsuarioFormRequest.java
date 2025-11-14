package io.github.pietro_dev.lavajaapi.rest.usuarios;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.UsuarioRole;
import io.github.pietro_dev.lavajaapi.model.Usuario;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UsuarioFormRequest {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;

    private UsuarioRole role;

    public UsuarioFormRequest(){
        super();
    }

    public UsuarioFormRequest(Long id, String nome, String email, String senha, LocalDate dataCadastro) {
        super();
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
    }

    public Usuario toModel(){
        return new Usuario(id, nome, email, senha, dataCadastro, role);
    }
}
