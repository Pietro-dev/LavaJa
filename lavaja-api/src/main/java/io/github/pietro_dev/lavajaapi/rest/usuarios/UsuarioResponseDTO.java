package io.github.pietro_dev.lavajaapi.rest.usuarios;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.Usuario;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;

    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.dataCadastro = usuario.getDataCadastro();
    }

//    public UsuarioResponseDTO(UsuarioFormRequest usuario) {
//        this.id = usuario.getId();
//        this.nome = usuario.getNome();
//        this.email = usuario.getEmail();
//        this.dataCadastro = usuario.getDataCadastro();
//    }
}
