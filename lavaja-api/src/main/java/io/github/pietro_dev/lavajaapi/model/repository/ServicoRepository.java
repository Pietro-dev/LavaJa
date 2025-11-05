package io.github.pietro_dev.lavajaapi.model.repository;

import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico,Long> {
    @Query("select new io.github.pietro_dev.lavajaapi.rest.servicos.ServicoListDTO(" +
            "s.id, s.servico, s.descricao, s.valor, s.duracao, s.dataCadastro, lr.id, lr.razaoSocial) " +
            "from Servico s join s.lavaRapido lr " +
            "where lower(lr.razaoSocial) like lower(concat('%', :razao, '%'))")
    List<ServicoListDTO> findByLavaRapidoRazaoSocialContainingIgnoreCase(@Param("razao") String razaoSocial);

}
