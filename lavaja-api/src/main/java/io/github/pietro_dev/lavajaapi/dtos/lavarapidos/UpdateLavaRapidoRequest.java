package io.github.pietro_dev.lavajaapi.dtos.lavarapidos;

import lombok.Data;

@Data
public class UpdateLavaRapidoRequest {
    private String razaoSocial;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String email;
}
