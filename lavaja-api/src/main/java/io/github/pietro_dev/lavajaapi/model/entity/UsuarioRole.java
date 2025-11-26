package io.github.pietro_dev.lavajaapi.model.entity;

public enum UsuarioRole {
    ADMIN("admin"),
    CLIENTE("cliente"),
    LAVARAPIDO("lava_rapido");

    private String role;

    UsuarioRole(String role) {
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
