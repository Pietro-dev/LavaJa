package io.github.pietro_dev.lavajaapi.config;

import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import io.github.pietro_dev.lavajaapi.model.entity.UsuarioRole;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    PasswordEncoder encoder;

    public DataInitializer(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        verificarEConfigurarAdmin();
    }

    private void verificarEConfigurarAdmin() {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(1L);

        if (usuarioOptional.isPresent()) {
            // Usuário existe, atualiza para admin
            Usuario usuario = usuarioOptional.get();
            usuario.setRole(UsuarioRole.ADMIN);
            usuarioRepository.save(usuario);
        } else {
            // Usuário não existe, cria novo admin
            Usuario novoAdmin = new Usuario();
            novoAdmin.setNome("admin");
            novoAdmin.setSenha(encoder.encode("123456"));
            novoAdmin.setRole(UsuarioRole.ADMIN);
            novoAdmin.setEmail("admin@email.com");
            usuarioRepository.save(novoAdmin);
            System.out.println("Usuário ADMIN com ID 1 criado");
        }
    }
}
