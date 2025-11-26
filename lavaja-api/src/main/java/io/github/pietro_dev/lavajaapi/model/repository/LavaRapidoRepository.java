package io.github.pietro_dev.lavajaapi.model.repository;

import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LavaRapidoRepository extends JpaRepository<LavaRapido, Long> {

    LavaRapido findByEmail(String email);

    Optional<LavaRapido> findLavaRapidoByEmail(String email);

    boolean existsByEmail(String email);
}
