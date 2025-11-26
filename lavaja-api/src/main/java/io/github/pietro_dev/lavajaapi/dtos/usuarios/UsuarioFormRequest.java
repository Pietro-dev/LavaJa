package io.github.pietro_dev.lavajaapi.dtos.usuarios;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.entity.UsuarioRole;
import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
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

    public Usuario toModel(){
        return new Usuario(id, nome, email, senha, dataCadastro, role);
    }
}
