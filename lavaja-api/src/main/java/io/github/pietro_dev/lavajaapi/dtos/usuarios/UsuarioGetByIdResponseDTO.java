package io.github.pietro_dev.lavajaapi.dtos.usuarios;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import lombok.Data;

import java.time.LocalDate;
@Data
public class UsuarioGetByIdResponseDTO {
    private Long id;
    private String nome;
    private String email;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;
    private String senhaAtual;

    public UsuarioGetByIdResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.dataCadastro = usuario.getDataCadastro();
        this.senhaAtual = usuario.getSenha();
    }
}
