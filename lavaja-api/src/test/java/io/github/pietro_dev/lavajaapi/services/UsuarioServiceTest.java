package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioFormRequest;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioUpdateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private UsuarioFormRequest usuarioFormRequest;
    private UsuarioUpdateRequest usuarioUpdateRequest;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João Silva");
        usuario.setEmail("joao@email.com");
        usuario.setSenha("senhaCriptografada123");

        usuarioFormRequest = new UsuarioFormRequest();
        usuarioFormRequest.setNome("Maria Santos");
        usuarioFormRequest.setEmail("maria@email.com");
        usuarioFormRequest.setSenha("senha123");

        usuarioUpdateRequest = new UsuarioUpdateRequest();
    }

    @Test
    @DisplayName("Deve atualizar usuário com sucesso quando dados são válidos")
    void atualizarUsuario_DeveAtualizarComSucesso() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaAtual123");
        usuarioUpdateRequest.setNome("Novo Nome");
        usuarioUpdateRequest.setEmail("novo@email.com");
        usuarioUpdateRequest.setNovaSenha("novaSenha123");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtual123", "senhaCriptografada123")).thenReturn(true);
        when(passwordEncoder.encode("novaSenha123")).thenReturn("novaSenhaCriptografada");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        verify(usuarioRepository).findById(1L);
        verify(passwordEncoder).matches("senhaAtual123", "senhaCriptografada123");
        verify(passwordEncoder).encode("novaSenha123");
        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve retornar 404 quando usuário não existe")
    void atualizarUsuario_DeveRetornarNotFoundQuandoUsuarioNaoExiste() {
        // Arrange
        when(usuarioRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(999L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> errorResponse = (Map<String, Object>) response.getBody();
        assertEquals("Usuário não encontrado.", errorResponse.get("message"));
        assertEquals(999L, errorResponse.get("userId"));

        verify(usuarioRepository).findById(999L);
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve retornar 401 quando senha atual é nula ou vazia")
    void atualizarUsuario_DeveRetornarUnauthorizedQuandoSenhaAtualInvalida() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual(""); // Senha vazia
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> errorResponse = (Map<String, Object>) response.getBody();
        assertEquals("Senha atual obrigatória para atualizar o perfil.", errorResponse.get("message"));

        verify(usuarioRepository).findById(1L);
        verify(passwordEncoder, never()).matches(any(), any());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve retornar 401 quando senha atual não confere")
    void atualizarUsuario_DeveRetornarUnauthorizedQuandoSenhaAtualNaoConfere() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaErrada");
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaErrada", "senhaCriptografada123")).thenReturn(false);

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> errorResponse = (Map<String, Object>) response.getBody();
        assertEquals("Senha atual inválida.", errorResponse.get("message"));

        verify(passwordEncoder).matches("senhaErrada", "senhaCriptografada123");
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve retornar 400 quando nova senha é muito curta")
    void atualizarUsuario_DeveRetornarBadRequestQuandoNovaSenhaMuitoCurta() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaAtual123");
        usuarioUpdateRequest.setNovaSenha("123"); // Senha muito curta
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtual123", "senhaCriptografada123")).thenReturn(true);

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> errorResponse = (Map<String, Object>) response.getBody();
        assertEquals("Nova senha deve ter pelo menos 6 caracteres.", errorResponse.get("message"));

        verify(passwordEncoder, never()).encode(any());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve retornar 400 quando nenhum campo válido para atualização é fornecido")
    void atualizarUsuario_DeveRetornarBadRequestQuandoNenhumaAlteracaoValida() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaAtual123");
        // Não seta nome, email ou novaSenha
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtual123", "senhaCriptografada123")).thenReturn(true);

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> errorResponse = (Map<String, Object>) response.getBody();
        assertEquals("Nenhum campo válido para atualização fornecido.", errorResponse.get("message"));

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve atualizar apenas o nome quando apenas nome é fornecido")
    void atualizarUsuario_DeveAtualizarApenasNome() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaAtual123");
        usuarioUpdateRequest.setNome("Novo Nome");
        // Não seta email ou novaSenha

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtual123", "senhaCriptografada123")).thenReturn(true);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Novo Nome", usuario.getNome()); // Verifica se o nome foi alterado
        assertEquals("joao@email.com", usuario.getEmail()); // Verifica se email permaneceu o mesmo
        assertEquals("senhaCriptografada123", usuario.getSenha()); // Verifica se senha permaneceu a mesma

        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve atualizar apenas o email quando apenas email é fornecido")
    void atualizarUsuario_DeveAtualizarApenasEmail() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaAtual123");
        usuarioUpdateRequest.setEmail("novo@email.com");
        // Não seta nome ou novaSenha

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtual123", "senhaCriptografada123")).thenReturn(true);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("novo@email.com", usuario.getEmail()); // Verifica se email foi alterado
        assertEquals("João Silva", usuario.getNome()); // Verifica se nome permaneceu o mesmo

        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve atualizar apenas a senha quando apenas nova senha é fornecida")
    void atualizarUsuario_DeveAtualizarApenasSenha() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaAtual123");
        usuarioUpdateRequest.setNovaSenha("novaSenha123");
        // Não seta nome ou email

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtual123", "senhaCriptografada123")).thenReturn(true);
        when(passwordEncoder.encode("novaSenha123")).thenReturn("novaSenhaCriptografada");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("novaSenhaCriptografada", usuario.getSenha()); // Verifica se senha foi alterada
        assertEquals("João Silva", usuario.getNome()); // Verifica se nome permaneceu o mesmo

        verify(passwordEncoder).encode("novaSenha123");
        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve retornar 500 quando ocorre exceção inesperada")
    void atualizarUsuario_DeveRetornarInternalServerErrorQuandoOcorreExcecao() {
        // Arrange
        usuarioUpdateRequest.setSenhaAtual("senhaAtual123");
        usuarioUpdateRequest.setNome("Novo Nome");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaAtual123", "senhaCriptografada123")).thenReturn(true);
        when(usuarioRepository.save(any(Usuario.class))).thenThrow(new RuntimeException("Erro de banco"));

        // Act
        ResponseEntity<?> response = usuarioService.atualizarUsuario(1L, usuarioUpdateRequest);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> errorResponse = (Map<String, Object>) response.getBody();
        assertTrue(((String) errorResponse.get("message")).contains("Erro interno"));
    }
}