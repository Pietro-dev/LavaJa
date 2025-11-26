package io.github.pietro_dev.lavajaapi.model.repository;

import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    UserDetails findByEmail(String email);

    Optional<Usuario> findUsuarioOptByEmail(String email);

    Usuario findUsuarioByEmail(String email);
}
