package io.github.pietro_dev.lavajaapi.rest.lavarapidos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoResponseDTO;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class LavaRapidoResponseDTO {
    private Long id;
    private String razaoSocial;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String email;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataCadastro;
    private List<ServicoResponseDTO> servicos;

    public LavaRapidoResponseDTO() {
        super();
    }

    public LavaRapidoResponseDTO(Long id, String razaoSocial, String cnpj, String endereco,
                                 String telefone, String email, LocalDate dataCadastro,
                                 List<ServicoResponseDTO> servicos) {
        this.id = id;
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.telefone = telefone;
        this.email = email;
        this.dataCadastro = dataCadastro;
        this.servicos = servicos;
    }
}