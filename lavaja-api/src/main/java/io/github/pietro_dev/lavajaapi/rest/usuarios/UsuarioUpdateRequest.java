package io.github.pietro_dev.lavajaapi.rest.usuarios;

import io.github.pietro_dev.lavajaapi.model.Usuario;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UsuarioUpdateRequest {
    private String nome;
    private String email;
    private String senhaAtual;
    private String novaSenha;
    private String role;
}