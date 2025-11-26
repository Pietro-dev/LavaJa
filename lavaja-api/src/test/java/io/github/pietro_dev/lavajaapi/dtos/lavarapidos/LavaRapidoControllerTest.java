package io.github.pietro_dev.lavajaapi.dtos.lavarapidos;

import io.github.pietro_dev.lavajaapi.controller.LavaRapidoController;
import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.services.LavaRapidoService;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LavaRapidoControllerTest {

    @Mock
    private LavaRapidoRepository lavaRapidoRepository;

    @Mock
    private LavaRapidoService lavaRapidoService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private LavaRapidoController lavaRapidoController;

    private LavaRapido lavaRapido;
    private LavaRapidoFormRequest lavaRapidoFormRequest;

    @BeforeEach
    void setUp() {
        // Setup LavaRapido entity
        lavaRapido = new LavaRapido(
                1L,
                "Lava Jato Express LTDA",
                "12.345.678/0001-90",
                "Rua Teste, 123 - Centro",
                "(11) 99999-9999",
                "lavajato@email.com",
                "senhaCriptografada",
                LocalDate.now()
        );

        // Setup LavaRapidoFormRequest
        lavaRapidoFormRequest = new LavaRapidoFormRequest();
        lavaRapidoFormRequest.setRazaoSocial("Lava Jato Express LTDA");
        lavaRapidoFormRequest.setCnpj("12.345.678/0001-90");
        lavaRapidoFormRequest.setEndereco("Rua Teste, 123 - Centro");
        lavaRapidoFormRequest.setTelefone("(11) 99999-9999");
        lavaRapidoFormRequest.setEmail("lavajato@email.com");
        lavaRapidoFormRequest.setSenha("senha123");
        lavaRapidoFormRequest.setDataCadastro(LocalDate.now());
    }

    @Test
    @DisplayName("Deve salvar lava rápido com sucesso quando email não existe")
    void salvar_DeveSalvarLavaRapidoQuandoEmailNaoExiste() {
        // Arrange
        when(lavaRapidoRepository.existsByEmail("lavajato@email.com")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("senhaCriptografada");
        when(lavaRapidoRepository.save(any(LavaRapido.class))).thenReturn(lavaRapido);

        // Act
        ResponseEntity<Object> response = lavaRapidoController.salvar(lavaRapidoFormRequest);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody() instanceof LavaRapidoFormRequest);

        LavaRapidoFormRequest responseBody = (LavaRapidoFormRequest) response.getBody();
        assertEquals(1L, responseBody.getId());
        assertEquals("Lava Jato Express LTDA", responseBody.getRazaoSocial());
        assertEquals("lavajato@email.com", responseBody.getEmail());

        verify(lavaRapidoRepository).existsByEmail("lavajato@email.com");
        verify(passwordEncoder).encode("senha123");
        verify(lavaRapidoRepository).save(any(LavaRapido.class));
    }

    @Test
    @DisplayName("Deve retornar erro quando email já existe ao salvar")
    void salvar_DeveRetornarErroQuandoEmailJaExiste() {
        // Arrange
        when(lavaRapidoRepository.existsByEmail("lavajato@email.com")).thenReturn(true);

        // Act
        ResponseEntity<Object> response = lavaRapidoController.salvar(lavaRapidoFormRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Já existe um lava-rápido cadastrado com este email: lavajato@email.com", response.getBody());

        verify(lavaRapidoRepository).existsByEmail("lavajato@email.com");
        verify(lavaRapidoRepository, never()).save(any(LavaRapido.class));
    }

    @Test
    @DisplayName("Deve retornar erro interno quando ocorre exceção")
    void salvar_DeveRetornarErroInternoQuandoOcorreExcecao() {
        // Arrange
        when(lavaRapidoRepository.existsByEmail("lavajato@email.com")).thenThrow(new RuntimeException("Erro de banco"));

        // Act
        ResponseEntity<Object> response = lavaRapidoController.salvar(lavaRapidoFormRequest);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erro interno no servidor", response.getBody());
    }

    @Test
    @DisplayName("Deve atualizar lava rápido com sucesso quando existe")
    void atualizar_DeveAtualizarLavaRapidoQuandoExiste() {
        // Arrange
        LavaRapidoFormRequest updateRequest = new LavaRapidoFormRequest();
        updateRequest.setRazaoSocial("Nova Razão Social");
        updateRequest.setCnpj("98.765.432/0001-10");
        updateRequest.setEndereco("Novo Endereço, 456");
        updateRequest.setTelefone("(11) 88888-8888");
        updateRequest.setEmail("novo@email.com");
        updateRequest.setSenha(""); // Senha vazia - não deve atualizar

        when(lavaRapidoRepository.findById(1L)).thenReturn(Optional.of(lavaRapido));
        when(lavaRapidoRepository.save(any(LavaRapido.class))).thenReturn(lavaRapido);

        // Act
        ResponseEntity<Object> response = lavaRapidoController.atualizar(1L, updateRequest);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // Verifica se os campos foram atualizados
        assertEquals("Nova Razão Social", lavaRapido.getRazaoSocial());
        assertEquals("98.765.432/0001-10", lavaRapido.getCnpj());
        assertEquals("Novo Endereço, 456", lavaRapido.getEndereco());
        assertEquals("(11) 88888-8888", lavaRapido.getTelefone());
        assertEquals("novo@email.com", lavaRapido.getEmail());
        assertEquals("senhaCriptografada", lavaRapido.getSenha()); // Senha não deve mudar

        verify(lavaRapidoRepository).findById(1L);
        verify(lavaRapidoRepository).save(lavaRapido);
    }

    @Test
    @DisplayName("Deve atualizar senha quando nova senha é fornecida")
    void atualizar_DeveAtualizarSenhaQuandoNovaSenhaFornecida() {
        // Arrange
        LavaRapidoFormRequest updateRequest = new LavaRapidoFormRequest();
        updateRequest.setRazaoSocial("Nova Razão Social");
        updateRequest.setSenha("novaSenha123"); // Nova senha fornecida

        when(lavaRapidoRepository.findById(1L)).thenReturn(Optional.of(lavaRapido));
        when(lavaRapidoRepository.save(any(LavaRapido.class))).thenReturn(lavaRapido);

        // Act
        ResponseEntity<Object> response = lavaRapidoController.atualizar(1L, updateRequest);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertEquals("novaSenha123", lavaRapido.getSenha()); // Senha deve ser atualizada

        verify(lavaRapidoRepository).findById(1L);
        verify(lavaRapidoRepository).save(lavaRapido);
    }

    @Test
    @DisplayName("Deve retornar 404 quando lava rápido não existe na atualização")
    void atualizar_DeveRetornarNotFoundQuandoLavaRapidoNaoExiste() {
        // Arrange
        when(lavaRapidoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Object> response = lavaRapidoController.atualizar(999L, lavaRapidoFormRequest);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(lavaRapidoRepository).findById(999L);
        verify(lavaRapidoRepository, never()).save(any(LavaRapido.class));
    }

    @Test
    @DisplayName("Deve retornar lava rápido por ID quando existe")
    void getById_DeveRetornarLavaRapidoQuandoExiste() {
        // Arrange
        when(lavaRapidoRepository.findById(1L)).thenReturn(Optional.of(lavaRapido));

        // Act
        ResponseEntity<LavaRapidoFormRequest> response = lavaRapidoController.getById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof LavaRapidoFormRequest);

        LavaRapidoFormRequest responseBody = response.getBody();
        assertEquals(1L, responseBody.getId());
        assertEquals("Lava Jato Express LTDA", responseBody.getRazaoSocial());
        assertEquals("lavajato@email.com", responseBody.getEmail());

        verify(lavaRapidoRepository).findById(1L);
    }

    @Test
    @DisplayName("Deve retornar 404 quando lava rápido não existe na busca por ID")
    void getById_DeveRetornarNotFoundQuandoLavaRapidoNaoExiste() {
        // Arrange
        when(lavaRapidoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<LavaRapidoFormRequest> response = lavaRapidoController.getById(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(lavaRapidoRepository).findById(999L);
    }

    @Test
    @DisplayName("Deve deletar lava rápido com sucesso quando existe")
    void delete_DeveDeletarLavaRapidoQuandoExiste() {
        // Arrange
        when(lavaRapidoRepository.findById(1L)).thenReturn(Optional.of(lavaRapido));

        // Act
        ResponseEntity<Object> response = lavaRapidoController.delete(1L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        verify(lavaRapidoRepository).findById(1L);
        verify(lavaRapidoRepository).delete(lavaRapido);
    }

    @Test
    @DisplayName("Deve retornar 404 quando lava rápido não existe na deleção")
    void delete_DeveRetornarNotFoundQuandoLavaRapidoNaoExiste() {
        // Arrange
        when(lavaRapidoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Object> response = lavaRapidoController.delete(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(lavaRapidoRepository).findById(999L);
        verify(lavaRapidoRepository, never()).delete(any(LavaRapido.class));
    }

    @Test
    @DisplayName("Deve retornar lista de lava rápidos")
    void getLista_DeveRetornarListaDeLavaRapidos() {
        // Arrange
        LavaRapido lavaRapido2 = new LavaRapido(
                2L,
                "Lava Jato Premium LTDA",
                "98.765.432/0001-10",
                "Av. Teste, 456",
                "(11) 88888-8888",
                "premium@email.com",
                "senha456",
                LocalDate.now()
        );

        List<LavaRapido> lavaRapidos = Arrays.asList(lavaRapido, lavaRapido2);
        when(lavaRapidoRepository.findAll()).thenReturn(lavaRapidos);

        // Act
        List<LavaRapidoResponseDTO> result = lavaRapidoController.getLista();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        LavaRapidoResponseDTO dto1 = result.get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("Lava Jato Express LTDA", dto1.getRazaoSocial());
        assertEquals("lavajato@email.com", dto1.getEmail());

        LavaRapidoResponseDTO dto2 = result.get(1);
        assertEquals(2L, dto2.getId());
        assertEquals("Lava Jato Premium LTDA", dto2.getRazaoSocial());

        verify(lavaRapidoRepository).findAll();
    }

    @Test
    @DisplayName("Deve retornar lista de lava rápidos com serviços")
    void getListaComServicos_DeveRetornarListaComServicos() {
        // Arrange
        LavaRapidoResponseDTO dto1 = new LavaRapidoResponseDTO(lavaRapido);
        LavaRapidoResponseDTO dto2 = new LavaRapidoResponseDTO(
                2L,
                "Lava Jato Premium",
                "98.765.432/0001-10",
                "Av. Teste, 456",
                "(11) 88888-8888",
                "premium@email.com",
                LocalDate.now(),
                null
        );

        List<LavaRapidoResponseDTO> lavaRapidosComServicos = Arrays.asList(dto1, dto2);
        when(lavaRapidoService.listarLavaRapidosComServico()).thenReturn(lavaRapidosComServicos);

        // Act
        ResponseEntity<List<LavaRapidoResponseDTO>> response = lavaRapidoController.getListaComServicos();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());

        verify(lavaRapidoService).listarLavaRapidosComServico();
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não há lava rápidos")
    void getLista_DeveRetornarListaVazia() {
        // Arrange
        when(lavaRapidoRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<LavaRapidoResponseDTO> result = lavaRapidoController.getLista();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(lavaRapidoRepository).findAll();
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não há lava rápidos com serviços")
    void getListaComServicos_DeveRetornarListaVazia() {
        // Arrange
        when(lavaRapidoService.listarLavaRapidosComServico()).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<List<LavaRapidoResponseDTO>> response = lavaRapidoController.getListaComServicos();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());

        verify(lavaRapidoService).listarLavaRapidosComServico();
    }
}