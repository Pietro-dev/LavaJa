package io.github.pietro_dev.lavajaapi.dtos.usuarios;

import io.github.pietro_dev.lavajaapi.model.entity.UsuarioRole;

public record UsuarioFormCadastroRequest(String nome, String email, String senha, UsuarioRole role) {

}
