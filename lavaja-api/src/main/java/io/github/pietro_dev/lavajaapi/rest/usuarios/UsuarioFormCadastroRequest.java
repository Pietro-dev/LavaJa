package io.github.pietro_dev.lavajaapi.rest.usuarios;

import io.github.pietro_dev.lavajaapi.model.UsuarioRole;

public record UsuarioFormCadastroRequest(String nome, String email, String senha) {

}
