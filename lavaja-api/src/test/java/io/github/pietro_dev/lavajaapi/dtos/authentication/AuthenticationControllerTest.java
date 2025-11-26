package io.github.pietro_dev.lavajaapi.dtos.authentication;

import io.github.pietro_dev.lavajaapi.controller.AuthenticationController;
import io.github.pietro_dev.lavajaapi.infra.security.TokenService;
import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import io.github.pietro_dev.lavajaapi.model.entity.UsuarioRole;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoFormRequest;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoResponseDTO;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioFormCadastroRequest;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioFormLoginRequest;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioLoginResponseDTO;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.UsuarioResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private LavaRapidoRepository lavaRapidoRepository;

    @InjectMocks
    private AuthenticationController authenticationController;

    private Usuario usuario;
    private LavaRapido lavaRapido;
    private UsuarioFormLoginRequest usuarioLoginRequest;
    private UsuarioFormCadastroRequest usuarioCadastroRequest;
    private LavaRapidoFormRequest lavaRapidoCadastroRequest;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João Silva");
        usuario.setEmail("joao@email.com");
        usuario.setSenha("senhaCriptografada123");
        usuario.setRole(UsuarioRole.CLIENTE);

        lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        lavaRapido.setRazaoSocial("Lava Jato Express");
        lavaRapido.setEmail("lavajato@email.com");
        lavaRapido.setSenha("senhaCriptografada456");
        lavaRapido.setCnpj("12.345.678/0001-90");
        lavaRapido.setTelefone("(11) 99999-9999");

        usuarioLoginRequest = new UsuarioFormLoginRequest("joao@email.com", "senha123");
        usuarioCadastroRequest = new UsuarioFormCadastroRequest("Maria Santos", "maria@email.com", "senha123", UsuarioRole.CLIENTE);

        lavaRapidoCadastroRequest = new LavaRapidoFormRequest();
        lavaRapidoCadastroRequest.setRazaoSocial("Novo Lava Jato");
        lavaRapidoCadastroRequest.setEmail("novo@lavajato.com");
        lavaRapidoCadastroRequest.setSenha("senha123");
        lavaRapidoCadastroRequest.setCnpj("98.765.432/0001-10");
        lavaRapidoCadastroRequest.setTelefone("(11) 88888-8888");
    }

    @Test
    @DisplayName("Deve fazer login de usuário com sucesso")
    void login_DeveRetornarTokenEIdQuandoCredenciaisSaoValidas() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(usuario);
        when(tokenService.generateToken(usuario)).thenReturn("token-jwt-gerado");
        when(usuarioRepository.findUsuarioOptByEmail("joao@email.com")).thenReturn(Optional.of(usuario));

        // Act
        ResponseEntity<?> response = authenticationController.login(usuarioLoginRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof UsuarioLoginResponseDTO);

        UsuarioLoginResponseDTO responseDTO = (UsuarioLoginResponseDTO) response.getBody();
        assertEquals("token-jwt-gerado", responseDTO.token());
        assertEquals(1L, responseDTO.usuarioId());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenService).generateToken(usuario);
        verify(usuarioRepository).findUsuarioOptByEmail("joao@email.com");
    }

    @Test
    @DisplayName("Deve retornar erro quando autenticação falha")
    void login_DeveRetornarErroQuandoAutenticacaoFalha() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Credenciais inválidas"));

        // Act
        ResponseEntity<?> response = authenticationController.login(usuarioLoginRequest);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode()); // Spring Security retorna 401
    }


    @Test
    @DisplayName("Deve retornar erro quando lava rápido não é encontrado no login")
    void loginLavaRapido_DeveRetornarErroQuandoLavaRapidoNaoEncontrado() {
        // Arrange
        when(lavaRapidoRepository.findLavaRapidoByEmail("inexistente@email.com"))
                .thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = authenticationController.loginLavaRapido(
                new UsuarioFormLoginRequest("inexistente@email.com", "senha123"));

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Lava Rápido não encontrado!", response.getBody());

        verify(lavaRapidoRepository).findLavaRapidoByEmail("inexistente@email.com");
        verify(tokenService, never()).generateLavaRapidoToken(any());
    }

    @Test
    @DisplayName("Deve retornar erro quando senha do lava rápido está incorreta")
    void loginLavaRapido_DeveRetornarErroQuandoSenhaIncorreta() {
        // Arrange
        when(lavaRapidoRepository.findLavaRapidoByEmail("lavajato@email.com"))
                .thenReturn(Optional.of(lavaRapido));

        // Act
        ResponseEntity<?> response = authenticationController.loginLavaRapido(
                new UsuarioFormLoginRequest("lavajato@email.com", "senhaErrada"));

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Senha inválida!", response.getBody());

        verify(lavaRapidoRepository).findLavaRapidoByEmail("lavajato@email.com");
        verify(tokenService, never()).generateLavaRapidoToken(any());
    }

    @Test
    @DisplayName("Deve cadastrar usuário com sucesso")
    void cadastro_DeveSalvarUsuarioQuandoEmailNaoExiste() {
        // Arrange
        when(usuarioRepository.findByEmail("maria@email.com")).thenReturn(null);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = authenticationController.cadastro(usuarioCadastroRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof UsuarioResponseDTO);

        UsuarioResponseDTO responseDTO = (UsuarioResponseDTO) response.getBody();
        assertNotNull(responseDTO);

        verify(usuarioRepository).findByEmail("maria@email.com");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve retornar erro quando email de usuário já está cadastrado")
    void cadastro_DeveRetornarErroQuandoEmailJaCadastrado() {
        // Arrange
        when(usuarioRepository.findByEmail("joao@email.com")).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = authenticationController.cadastro(
                new UsuarioFormCadastroRequest("João", "joao@email.com", "senha123", UsuarioRole.CLIENTE));

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("E-mail já cadastrado!", response.getBody());

        verify(usuarioRepository).findByEmail("joao@email.com");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve cadastrar lava rápido com sucesso")
    void cadastroLavaRapido_DeveSalvarLavaRapidoQuandoEmailNaoExiste() {
        // Arrange
        when(lavaRapidoRepository.findByEmail("novo@lavajato.com")).thenReturn(null);
        when(lavaRapidoRepository.save(any(LavaRapido.class))).thenReturn(lavaRapido);

        // Act
        ResponseEntity<?> response = authenticationController.cadastroLavaRapido(lavaRapidoCadastroRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof LavaRapidoResponseDTO);

        LavaRapidoResponseDTO responseDTO = (LavaRapidoResponseDTO) response.getBody();
        assertNotNull(responseDTO);

        verify(lavaRapidoRepository).findByEmail("novo@lavajato.com");
        verify(lavaRapidoRepository).save(any(LavaRapido.class));

        // Verifica se a senha foi criptografada
        assertNotNull(lavaRapidoCadastroRequest.getSenha());
        assertTrue(lavaRapidoCadastroRequest.getSenha().startsWith("$2a$")); // Prefixo do BCrypt
    }

    @Test
    @DisplayName("Deve retornar erro quando email de lava rápido já está cadastrado")
    void cadastroLavaRapido_DeveRetornarErroQuandoEmailJaCadastrado() {
        // Arrange
        when(lavaRapidoRepository.findByEmail("lavajato@email.com")).thenReturn(lavaRapido);

        lavaRapidoCadastroRequest.setEmail("lavajato@email.com");

        // Act
        ResponseEntity<?> response = authenticationController.cadastroLavaRapido(lavaRapidoCadastroRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("E-mail já cadastrado!", response.getBody());

        verify(lavaRapidoRepository).findByEmail("lavajato@email.com");
        verify(lavaRapidoRepository, never()).save(any(LavaRapido.class));
    }

    @Test
    @DisplayName("Deve criptografar senha no cadastro de usuário")
    void cadastro_DeveCriptografarSenhaDoUsuario() {
        // Arrange
        when(usuarioRepository.findByEmail("maria@email.com")).thenReturn(null);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuarioSalvo = invocation.getArgument(0);
            // Verifica se a senha foi criptografada
            assertTrue(usuarioSalvo.getSenha().startsWith("$2a$"));
            return usuarioSalvo;
        });

        // Act
        ResponseEntity<?> response = authenticationController.cadastro(usuarioCadastroRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve criptografar senha no cadastro de lava rápido")
    void cadastroLavaRapido_DeveCriptografarSenhaDoLavaRapido() {
        // Arrange
        when(lavaRapidoRepository.findByEmail("novo@lavajato.com")).thenReturn(null);
        when(lavaRapidoRepository.save(any(LavaRapido.class))).thenAnswer(invocation -> {
            LavaRapido lavaRapidoSalvo = invocation.getArgument(0);
            // Verifica se a senha foi criptografada
            assertTrue(lavaRapidoSalvo.getSenha().startsWith("$2a$"));
            return lavaRapidoSalvo;
        });

        // Act
        ResponseEntity<?> response = authenticationController.cadastroLavaRapido(lavaRapidoCadastroRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(lavaRapidoRepository).save(any(LavaRapido.class));
    }

    @Test
    @DisplayName("Deve lidar com exceção inesperada no login de lava rápido")
    void loginLavaRapido_DeveLidarComExcecaoInesperada() {
        // Arrange
        when(lavaRapidoRepository.findLavaRapidoByEmail("lavajato@email.com"))
                .thenThrow(new RuntimeException("Erro de banco de dados"));

        // Act
        ResponseEntity<?> response = authenticationController.loginLavaRapido(
                new UsuarioFormLoginRequest("lavajato@email.com", "senha123"));

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Erro de banco de dados", response.getBody());
    }
}