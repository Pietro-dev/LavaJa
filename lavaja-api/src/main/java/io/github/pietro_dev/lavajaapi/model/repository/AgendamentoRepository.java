package io.github.pietro_dev.lavajaapi.model.repository;

import io.github.pietro_dev.lavajaapi.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("""
        SELECT a FROM Agendamento a
        WHERE a.lavaRapido.id = :lavaRapidoId
          AND (
            (a.horaInicio < :fim AND a.horaFim > :inicio)
          )
    """)
    List<Agendamento> findOverlappingForLavaRapido(
            @Param("lavaRapidoId") Long lavaRapidoId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    // Conta agendamentos por lava rápido
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.lavaRapido.id = :lavaRapidoId")
    long countByLavaRapidoId(@Param("lavaRapidoId") Long lavaRapidoId);

    // Conta usuários distintos por lava rápido
    @Query("SELECT COUNT(DISTINCT a.usuario.id) FROM Agendamento a WHERE a.lavaRapido.id = :lavaRapidoId")
    long countDistinctUsuariosByLavaRapidoId(@Param("lavaRapidoId") Long lavaRapidoId);
}
