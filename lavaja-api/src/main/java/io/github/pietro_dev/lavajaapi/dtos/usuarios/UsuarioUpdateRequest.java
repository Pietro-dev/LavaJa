package io.github.pietro_dev.lavajaapi.dtos.usuarios;

import lombok.Data;

@Data
public class UsuarioUpdateRequest {
    private String nome;
    private String email;
    private String senhaAtual;
    private String novaSenha;
    private String role;
}