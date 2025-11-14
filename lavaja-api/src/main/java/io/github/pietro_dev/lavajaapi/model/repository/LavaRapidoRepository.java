package io.github.pietro_dev.lavajaapi.model.repository;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface LavaRapidoRepository extends JpaRepository<LavaRapido, Long> {

    LavaRapido findByEmail(String email);

    Optional<LavaRapido> findLavaRapidoByEmail(String email);

    boolean existsByEmail(String email);
}
