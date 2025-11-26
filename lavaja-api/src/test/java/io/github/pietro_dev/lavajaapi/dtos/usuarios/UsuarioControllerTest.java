package io.github.pietro_dev.lavajaapi.dtos.usuarios;

import io.github.pietro_dev.lavajaapi.controller.UsuarioController;
import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import io.github.pietro_dev.lavajaapi.model.entity.UsuarioRole;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.services.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    private Usuario usuario;
    private UsuarioFormRequest usuarioFormRequest;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João Silva");
        usuario.setEmail("joao@email.com");
        usuario.setSenha("senhaCriptografada");
        usuario.setDataCadastro(LocalDate.now());
        usuario.setRole(UsuarioRole.CLIENTE);

        usuarioFormRequest = new UsuarioFormRequest();
        usuarioFormRequest.setNome("Maria Santos");
        usuarioFormRequest.setEmail("maria@email.com");
        usuarioFormRequest.setSenha("senha123");
        usuarioFormRequest.setDataCadastro(LocalDate.now());
        usuarioFormRequest.setRole(UsuarioRole.CLIENTE);
    }

    @Test
    @DisplayName("Deve salvar usuário com sucesso")
    void salvar_DeveRetornarUsuarioSalvo() {
        // Arrange
        when(usuarioService.salvar(any(UsuarioFormRequest.class))).thenReturn(usuario);

        // Act
        ResponseEntity<Usuario> response = usuarioController.salvar(usuarioFormRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("João Silva", response.getBody().getNome());
        assertEquals("joao@email.com", response.getBody().getEmail());

        verify(usuarioService).salvar(usuarioFormRequest);
    }

    @Test
    @DisplayName("Deve retornar lista de usuários")
    void listarUsuarios_DeveRetornarListaDeUsuarios() {
        // Arrange
        Usuario usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNome("Maria Santos");
        usuario2.setEmail("maria@email.com");

        List<Usuario> usuarios = Arrays.asList(usuario, usuario2);
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // Act
        List<UsuarioResponseDTO> result = usuarioController.listarUsuarios();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        UsuarioResponseDTO dto1 = result.get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("João Silva", dto1.getNome());
        assertEquals("joao@email.com", dto1.getEmail());

        UsuarioResponseDTO dto2 = result.get(1);
        assertEquals(2L, dto2.getId());
        assertEquals("Maria Santos", dto2.getNome());

        verify(usuarioRepository).findAll();
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não há usuários")
    void listarUsuarios_DeveRetornarListaVazia() {
        // Arrange
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<UsuarioResponseDTO> result = usuarioController.listarUsuarios();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(usuarioRepository).findAll();
    }

    @Test
    @DisplayName("Deve retornar usuário por ID quando existe")
    void getUsuarioById_DeveRetornarUsuarioQuandoExiste() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act
        ResponseEntity<UsuarioGetByIdResponseDTO> response = usuarioController.getUsuarioById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof UsuarioGetByIdResponseDTO);

        UsuarioGetByIdResponseDTO responseBody = response.getBody();
        assertEquals(1L, responseBody.getId());
        assertEquals("João Silva", responseBody.getNome());
        assertEquals("joao@email.com", responseBody.getEmail());
        assertEquals("senhaCriptografada", responseBody.getSenhaAtual());

        verify(usuarioRepository).findById(1L);
    }

    @Test
    @DisplayName("Deve retornar 404 quando usuário não existe")
    void getUsuarioById_DeveRetornarNotFoundQuandoUsuarioNaoExiste() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<UsuarioGetByIdResponseDTO> response = usuarioController.getUsuarioById(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(usuarioRepository).findById(999L);
    }

    @Test
    @DisplayName("Deve atualizar usuário como admin quando dados são válidos")
    void atualizarUsuario_DeveAtualizarQuandoDadosValidos() {
        // Arrange
        UsuarioUpdateRequestNoPassword updateRequest = new UsuarioUpdateRequestNoPassword("Novo Nome", "novo@email.com");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.findUsuarioByEmail("novo@email.com")).thenReturn(null);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = usuarioController.atualizarUsuario(1L, updateRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof UsuarioResponseDTO);

        UsuarioResponseDTO responseBody = (UsuarioResponseDTO) response.getBody();
        assertEquals(1L, responseBody.getId());
        assertEquals("Novo Nome", usuario.getNome());
        assertEquals("novo@email.com", usuario.getEmail());

        verify(usuarioRepository).findById(1L);
        verify(usuarioRepository).findUsuarioByEmail("novo@email.com");
        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve retornar erro quando email já existe em outro usuário")
    void atualizarUsuario_DeveRetornarErroQuandoEmailEmUso() {
        // Arrange
        UsuarioUpdateRequestNoPassword updateRequest = new UsuarioUpdateRequestNoPassword("Novo Nome", "existente@email.com");

        Usuario outroUsuario = new Usuario();
        outroUsuario.setId(2L);
        outroUsuario.setEmail("existente@email.com");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.findUsuarioByEmail("existente@email.com")).thenReturn(outroUsuario);

        // Act
        ResponseEntity<?> response = usuarioController.atualizarUsuario(1L, updateRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("E-mail já cadastrado em outro usuário!", response.getBody());

        verify(usuarioRepository).findById(1L);
        verify(usuarioRepository).findUsuarioByEmail("existente@email.com");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve retornar 404 quando usuário não existe na atualização admin")
    void atualizarUsuario_DeveRetornarNotFoundQuandoUsuarioNaoExiste() {
        // Arrange
        UsuarioUpdateRequestNoPassword updateRequest = new UsuarioUpdateRequestNoPassword("Novo Nome", "novo@email.com");
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = usuarioController.atualizarUsuario(999L, updateRequest);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(usuarioRepository).findById(999L);
        verify(usuarioRepository, never()).findUsuarioByEmail(anyString());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve permitir atualização quando email não mudou")
    void atualizarUsuario_DevePermitirAtualizacaoQuandoEmailNaoMudou() {
        // Arrange
        UsuarioUpdateRequestNoPassword updateRequest = new UsuarioUpdateRequestNoPassword("Novo Nome", "joao@email.com");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.findUsuarioByEmail("joao@email.com")).thenReturn(usuario); // Mesmo usuário
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = usuarioController.atualizarUsuario(1L, updateRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Novo Nome", usuario.getNome());
        assertEquals("joao@email.com", usuario.getEmail()); // Email permanece o mesmo

        verify(usuarioRepository).findById(1L);
        verify(usuarioRepository).findUsuarioByEmail("joao@email.com");
        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve deletar usuário quando existe")
    void deletar_DeveDeletarUsuarioQuandoExiste() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act
        ResponseEntity<Object> response = usuarioController.deletar(1L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(usuarioRepository).findById(1L);
        verify(usuarioRepository).delete(usuario);
    }

    @Test
    @DisplayName("Deve retornar 404 quando usuário não existe na deleção")
    void deletar_DeveRetornarNotFoundQuandoUsuarioNaoExiste() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Object> response = usuarioController.deletar(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(usuarioRepository).findById(999L);
        verify(usuarioRepository, never()).delete(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve lidar com exceção no serviço de salvar")
    void salvar_DeveLidarComExcecaoNoServico() {
        // Arrange
        when(usuarioService.salvar(any(UsuarioFormRequest.class)))
                .thenThrow(new RuntimeException("Erro no serviço"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            usuarioController.salvar(usuarioFormRequest);
        });

        verify(usuarioService).salvar(usuarioFormRequest);
    }

    @Test
    @DisplayName("Deve lidar com exceção no repositório ao listar usuários")
    void listarUsuarios_DeveLidarComExcecao() {
        // Arrange
        when(usuarioRepository.findAll()).thenThrow(new RuntimeException("Erro de banco"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            usuarioController.listarUsuarios();
        });

        verify(usuarioRepository).findAll();
    }
}