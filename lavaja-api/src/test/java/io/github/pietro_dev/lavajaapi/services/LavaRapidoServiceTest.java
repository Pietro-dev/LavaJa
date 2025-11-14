package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.rest.lavarapidos.LavaRapidoResponseDTO;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LavaRapidoServiceTest {

    @Mock
    private LavaRapidoRepository lavaRapidoRepository;

    @InjectMocks
    private LavaRapidoService lavaRapidoService;

    private LavaRapido lavaRapido;
    private Servico servico1;
    private Servico servico2;
    private final LocalDate dataCadastro = LocalDate.now();

    @BeforeEach
    void setUp() {
        // Configuração dos objetos de teste
        servico1 = new Servico();
        servico1.setId(1L);
        servico1.setServico("Lavagem Completa");
        servico1.setDescricao("Lavagem interna e externa");
        servico1.setValor(new BigDecimal("50.00"));
        servico1.setDuracao(BigDecimal.valueOf(60));
        servico1.setDataCadastro(dataCadastro);

        servico2 = new Servico();
        servico2.setId(2L);
        servico2.setServico("Lavagem Simples");
        servico2.setDescricao("Lavagem externa apenas");
        servico2.setValor(new BigDecimal("25.00"));
        servico2.setDuracao(BigDecimal.valueOf(30));
        servico2.setDataCadastro(dataCadastro);

        lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        lavaRapido.setRazaoSocial("Lava Rápido Express");
        lavaRapido.setCnpj("12.345.678/0001-90");
        lavaRapido.setEndereco("Rua Teste, 123");
        lavaRapido.setTelefone("(11) 99999-9999");
        lavaRapido.setEmail("contato@lavarapido.com");
        lavaRapido.setDataCadastro(dataCadastro);
        lavaRapido.setServicos(Arrays.asList(servico1, servico2));
    }

    @Test
    void findByIdWithServicos_WhenLavaRapidoExists_ShouldReturnLavaRapidoResponseDTO() {
        // Arrange
        Long id = 1L;
        when(lavaRapidoRepository.findById(id)).thenReturn(Optional.of(lavaRapido));

        // Act
        LavaRapidoResponseDTO result = lavaRapidoService.findByIdWithServicos(id);

        // Assert
        assertNotNull(result);
        assertEquals(lavaRapido.getId(), result.getTelefone());
        assertEquals(lavaRapido.getRazaoSocial(), result.getEmail());
        assertEquals(lavaRapido.getCnpj(), result.getTelefone());
        assertEquals(lavaRapido.getEndereco(), result.getEmail());
        assertEquals(lavaRapido.getTelefone(), result.getTelefone());
        assertEquals(lavaRapido.getEmail(), result.getEmail());
        assertEquals(lavaRapido.getDataCadastro(), result.getDataCadastro());

        // Verifica os serviços
        assertNotNull(result.getServicos());
        assertEquals(2, result.getServicos().size());

        ServicoResponseDTO servicoDTO1 = result.getServicos().get(0);
        assertEquals(servico1.getId(), servicoDTO1.getServico());
        assertEquals(servico1.getServico(), servicoDTO1.getServico());
        assertEquals(servico1.getDescricao(), servicoDTO1.getServico());
        assertEquals(servico1.getValor(), servicoDTO1.getValor());
        assertEquals(servico1.getDuracao(), servicoDTO1.getDuracao());
        assertEquals(servico1.getDataCadastro(), servicoDTO1.getDataCadastro());

        verify(lavaRapidoRepository, times(1)).findById(id);
    }

    @Test
    void findByIdWithServicos_WhenLavaRapidoDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        Long id = 999L;
        when(lavaRapidoRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> lavaRapidoService.findByIdWithServicos(id)
        );

        assertEquals("LavaRapido não encontrado", exception.getMessage());
        verify(lavaRapidoRepository, times(1)).findById(id);
    }

    @Test
    void listarLavaRapidosComServico_WhenLavaRapidosExist_ShouldReturnListOfLavaRapidoResponseDTO() {
        // Arrange
        LavaRapido lavaRapido2 = new LavaRapido();
        lavaRapido2.setId(2L);
        lavaRapido2.setRazaoSocial("Outro Lava Rápido");
        lavaRapido2.setCnpj("98.765.432/0001-10");
        lavaRapido2.setServicos(Arrays.asList(servico1));

        List<LavaRapido> lavaRapidos = Arrays.asList(lavaRapido, lavaRapido2);
        when(lavaRapidoRepository.findAll()).thenReturn(lavaRapidos);

        // Act
        List<LavaRapidoResponseDTO> result = lavaRapidoService.listarLavaRapidosComServico();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        // Verifica o primeiro LavaRapido
        LavaRapidoResponseDTO dto1 = result.get(0);
        assertEquals(lavaRapido.getId(), dto1.getId());
        assertEquals(lavaRapido.getRazaoSocial(), dto1.getRazaoSocial());
        assertEquals(2, dto1.getServicos().size());

        // Verifica o segundo LavaRapido
        LavaRapidoResponseDTO dto2 = result.get(1);
        assertEquals(lavaRapido2.getId(), dto2.getId());
        assertEquals(lavaRapido2.getRazaoSocial(), dto2.getRazaoSocial());
        assertEquals(1, dto2.getServicos().size());

        verify(lavaRapidoRepository, times(1)).findAll();
    }

    @Test
    void listarLavaRapidosComServico_WhenNoLavaRapidosExist_ShouldReturnEmptyList() {
        // Arrange
        when(lavaRapidoRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<LavaRapidoResponseDTO> result = lavaRapidoService.listarLavaRapidosComServico();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(lavaRapidoRepository, times(1)).findAll();
    }

    @Test
    void listarLavaRapidosComServico_WhenLavaRapidoHasNoServicos_ShouldReturnDTOWithEmptyServicosList() {
        // Arrange
        LavaRapido lavaRapidoSemServicos = new LavaRapido();
        lavaRapidoSemServicos.setId(3L);
        lavaRapidoSemServicos.setRazaoSocial("Lava Rápido Sem Serviços");
        lavaRapidoSemServicos.setCnpj("11.222.333/0001-44");
        lavaRapidoSemServicos.setServicos(Arrays.asList()); // Lista vazia de serviços

        when(lavaRapidoRepository.findAll()).thenReturn(Arrays.asList(lavaRapidoSemServicos));

        // Act
        List<LavaRapidoResponseDTO> result = lavaRapidoService.listarLavaRapidosComServico();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());

        LavaRapidoResponseDTO dto = result.get(0);
        assertEquals(lavaRapidoSemServicos.getId(), dto.getId());
        assertEquals(lavaRapidoSemServicos.getRazaoSocial(), dto.getRazaoSocial());
        assertNotNull(dto.getServicos());
        assertTrue(dto.getServicos().isEmpty());

        verify(lavaRapidoRepository, times(1)).findAll();
    }
}