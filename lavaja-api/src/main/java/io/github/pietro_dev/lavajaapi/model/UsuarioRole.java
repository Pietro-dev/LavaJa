package io.github.pietro_dev.lavajaapi.model;

public enum UsuarioRole {
    ADMIN("admin"),
    CLIENTE("cliente");

    private String role;

    UsuarioRole(String role) {
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
