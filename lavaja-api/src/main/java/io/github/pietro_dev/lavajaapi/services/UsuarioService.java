package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioFormRequest;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioResponseDTO;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;



import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario salvar(UsuarioFormRequest usuarioFormRequest) {
        Usuario usuario = usuarioFormRequest.toModel();

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public ResponseEntity<?> atualizarUsuario(Long id, UsuarioUpdateRequest dto) {
        try {
            log.info("Tentativa de atualização do usuário ID: {}", id);

            Optional<Usuario> opt = usuarioRepository.findById(id);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Usuário não encontrado.", id));
            }

            Usuario existing = opt.get();

            // Validação da senha atual
            if (dto.getSenhaAtual() == null || dto.getSenhaAtual().isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Senha atual obrigatória para atualizar o perfil.", id));
            }

            if (!passwordEncoder.matches(dto.getSenhaAtual(), existing.getSenha())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Senha atual inválida.", id));
            }

            // Aplicar atualizações
            boolean hasChanges = false;

            if (dto.getNome() != null && !dto.getNome().isBlank()) {
                existing.setNome(dto.getNome());
                hasChanges = true;
            }

            if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
                existing.setEmail(dto.getEmail());
                hasChanges = true;
            }

            if (dto.getNovaSenha() != null && !dto.getNovaSenha().isBlank()) {
                if (dto.getNovaSenha().length() < 6) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(createErrorResponse("Nova senha deve ter pelo menos 6 caracteres.", id));
                }
                existing.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
                hasChanges = true;
            }

            if (!hasChanges) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Nenhum campo válido para atualização fornecido.", id));
            }

            Usuario saved = usuarioRepository.save(existing);
            log.info("Usuário ID: {} atualizado com sucesso", id);

            return ResponseEntity.ok(new UsuarioResponseDTO(saved));

        } catch (Exception ex) {
            log.error("Erro inesperado ao atualizar usuário ID: {}", id, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erro interno: " + ex.getMessage(), id));
        }
    }

    private Map<String, Object> createErrorResponse(String message, Long userId) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", "error");
        errorResponse.put("message", message);
        errorResponse.put("userId", userId);
        return errorResponse;
    }


}
