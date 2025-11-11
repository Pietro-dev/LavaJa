package io.github.pietro_dev.lavajaapi.model.repository;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LavaRapidoRepository extends JpaRepository<LavaRapido, Long> {
    Boolean existsByEmail(String email);
}
