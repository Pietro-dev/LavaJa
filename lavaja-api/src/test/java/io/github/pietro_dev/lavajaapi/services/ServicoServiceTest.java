package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoFormRequest;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoListDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServicoServiceTest {

    @Mock
    private ServicoRepository servicoRepository;

    @Mock
    private LavaRapidoRepository lavaRapidoRepository;

    @InjectMocks
    private ServicoService servicoService;

    @Test
    void deveSalvarServicoComSucesso() {
        // Arrange
        ServicoFormRequest request = new ServicoFormRequest();
        request.setLavaRapidoId(1L);
        request.setServico("Lavagem Completa");
        request.setDescricao("Lavagem interna e externa");
        request.setValor(new BigDecimal("50.00"));
        request.setDuracao(new BigDecimal("60"));
        request.setDataCadastro(LocalDate.now());

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        lavaRapido.setRazaoSocial("Lava Rápido Teste");

        Servico servicoSalvo = new Servico();
        servicoSalvo.setId(1L);
        servicoSalvo.setServico("Lavagem Completa");
        servicoSalvo.setLavaRapido(lavaRapido);

        when(lavaRapidoRepository.findById(1L)).thenReturn(Optional.of(lavaRapido));
        when(servicoRepository.save(any(Servico.class))).thenReturn(servicoSalvo);

        // Act
        Servico resultado = servicoService.salvar(request);

        // Assert
        assertNotNull(resultado);
        assertEquals("Lavagem Completa", resultado.getServico());
        assertNotNull(resultado.getLavaRapido());
        assertEquals(1L, resultado.getLavaRapido().getId());

        verify(lavaRapidoRepository, times(1)).findById(1L);
        verify(servicoRepository, times(1)).save(any(Servico.class));
    }

    @Test
    void deveLancarExcecaoQuandoLavaRapidoNaoExiste() {
        // Arrange
        ServicoFormRequest request = new ServicoFormRequest();
        request.setLavaRapidoId(999L); // ID inexistente

        when(lavaRapidoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> servicoService.salvar(request)
        );

        assertEquals("Lava-Rápido não encontrado!", exception.getMessage());
        verify(lavaRapidoRepository, times(1)).findById(999L);
        verify(servicoRepository, never()).save(any(Servico.class));
    }

    @Test
    void deveListarTodosServicosQuandoRazaoSocialForNula() {
        // Arrange
        Servico servico1 = new Servico();
        servico1.setId(1L);
        servico1.setServico("Lavagem Simples");
        servico1.setDescricao("Lavagem básica");
        servico1.setValor(new BigDecimal("30.00"));
        servico1.setDuracao(new BigDecimal("30"));
        servico1.setDataCadastro(LocalDate.now());

        LavaRapido lavaRapido1 = new LavaRapido();
        lavaRapido1.setId(1L);
        lavaRapido1.setRazaoSocial("Lava Rápido A");
        servico1.setLavaRapido(lavaRapido1);

        Servico servico2 = new Servico();
        servico2.setId(2L);
        servico2.setServico("Lavagem Completa");
        servico2.setDescricao("Lavagem completa");
        servico2.setValor(new BigDecimal("60.00"));
        servico2.setDuracao(new BigDecimal("60"));
        servico2.setDataCadastro(LocalDate.now());

        LavaRapido lavaRapido2 = new LavaRapido();
        lavaRapido2.setId(2L);
        lavaRapido2.setRazaoSocial("Lava Rápido B");
        servico2.setLavaRapido(lavaRapido2);

        List<Servico> servicos = Arrays.asList(servico1, servico2);

        when(servicoRepository.findAll()).thenReturn(servicos);

        // Act
        List<ServicoListDTO> resultado = servicoService.listarPorRazaoSocialLavaRapido(null);

        // Assert
        assertEquals(2, resultado.size());

        // Verifica primeiro serviço
        assertEquals(1L, resultado.get(0).getId());
        assertEquals("Lavagem Simples", resultado.get(0).getServico());
        assertEquals("Lava Rápido A", resultado.get(0).getLavaRapidoNome());

        // Verifica segundo serviço
        assertEquals(2L, resultado.get(1).getId());
        assertEquals("Lavagem Completa", resultado.get(1).getServico());
        assertEquals("Lava Rápido B", resultado.get(1).getLavaRapidoNome());

        verify(servicoRepository, times(1)).findAll();
        verify(servicoRepository, never()).findByLavaRapidoRazaoSocialContainingIgnoreCase(anyString());
    }

    @Test
    void deveListarTodosServicosQuandoRazaoSocialForVazia() {
        // Arrange
        Servico servico = new Servico();
        servico.setId(1L);
        servico.setServico("Lavagem Simples");

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        lavaRapido.setRazaoSocial("Lava Rápido Teste");
        servico.setLavaRapido(lavaRapido);

        List<Servico> servicos = List.of(servico);
        when(servicoRepository.findAll()).thenReturn(servicos);

        // Act
        List<ServicoListDTO> resultado = servicoService.listarPorRazaoSocialLavaRapido("");

        // Assert
        assertEquals(1, resultado.size());
        verify(servicoRepository, times(1)).findAll();
        verify(servicoRepository, never()).findByLavaRapidoRazaoSocialContainingIgnoreCase(anyString());
    }

    @Test
    void deveListarTodosServicosQuandoRazaoSocialForEmBranco() {
        // Arrange
        Servico servico = new Servico();
        servico.setId(1L);
        servico.setServico("Lavagem Simples");

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        lavaRapido.setRazaoSocial("Lava Rápido Teste");
        servico.setLavaRapido(lavaRapido);

        List<Servico> servicos = List.of(servico);
        when(servicoRepository.findAll()).thenReturn(servicos);

        // Act
        List<ServicoListDTO> resultado = servicoService.listarPorRazaoSocialLavaRapido("   ");

        // Assert
        assertEquals(1, resultado.size());
        verify(servicoRepository, times(1)).findAll();
        verify(servicoRepository, never()).findByLavaRapidoRazaoSocialContainingIgnoreCase(anyString());
    }

    @Test
    void deveListarServicosFiltradosPorRazaoSocial() {
        // Arrange
        String razaoSocialFiltro = "Lava Jato";

        ServicoListDTO servicoDTO1 = new ServicoListDTO(
                1L, "Lavagem Completa", "Descrição 1",
                new BigDecimal("50.00"), new BigDecimal("60"),
                LocalDate.now(), 1L, "Lava Jato Central"
        );

        ServicoListDTO servicoDTO2 = new ServicoListDTO(
                2L, "Lavagem Simples", "Descrição 2",
                new BigDecimal("30.00"), new BigDecimal("30"),
                LocalDate.now(), 1L, "Lava Jato Central"
        );

        List<ServicoListDTO> servicosFiltrados = Arrays.asList(servicoDTO1, servicoDTO2);

        when(servicoRepository.findByLavaRapidoRazaoSocialContainingIgnoreCase(razaoSocialFiltro))
                .thenReturn(servicosFiltrados);

        // Act
        List<ServicoListDTO> resultado = servicoService.listarPorRazaoSocialLavaRapido(razaoSocialFiltro);

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("Lava Jato Central", resultado.get(0).getLavaRapidoNome());
        assertEquals("Lava Jato Central", resultado.get(1).getLavaRapidoNome());

        verify(servicoRepository, times(1)).findByLavaRapidoRazaoSocialContainingIgnoreCase(razaoSocialFiltro);
        verify(servicoRepository, never()).findAll();
    }

    @Test
    void deveBuscarServicosPorLavaRapidoId() {
        // Arrange
        Long lavaRapidoId = 1L;

        Servico servico1 = new Servico();
        servico1.setId(1L);
        servico1.setServico("Lavagem Simples");

        Servico servico2 = new Servico();
        servico2.setId(2L);
        servico2.setServico("Lavagem Completa");

        List<Servico> servicos = Arrays.asList(servico1, servico2);

        when(servicoRepository.findByLavaRapidoId(lavaRapidoId)).thenReturn(servicos);

        // Act
        List<Servico> resultado = servicoService.findByLavaRapidoId(lavaRapidoId);

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("Lavagem Simples", resultado.get(0).getServico());
        assertEquals("Lavagem Completa", resultado.get(1).getServico());

        verify(servicoRepository, times(1)).findByLavaRapidoId(lavaRapidoId);
    }

    @Test
    void deveRetornarListaVaziaQuandoNaoHaServicosParaLavaRapido() {
        // Arrange
        Long lavaRapidoId = 999L;
        when(servicoRepository.findByLavaRapidoId(lavaRapidoId)).thenReturn(List.of());

        // Act
        List<Servico> resultado = servicoService.findByLavaRapidoId(lavaRapidoId);

        // Assert
        assertTrue(resultado.isEmpty());
        verify(servicoRepository, times(1)).findByLavaRapidoId(lavaRapidoId);
    }

    @Test
    void deveRetornarListaVaziaQuandoNaoHaServicosCadastrados() {
        // Arrange
        when(servicoRepository.findAll()).thenReturn(List.of());

        // Act
        List<ServicoListDTO> resultado = servicoService.listarPorRazaoSocialLavaRapido(null);

        // Assert
        assertTrue(resultado.isEmpty());
        verify(servicoRepository, times(1)).findAll();
    }

    @Test
    void deveConverterServicoParaDTOComTodosOsDados() {
        // Arrange
        Servico servico = new Servico();
        servico.setId(1L);
        servico.setServico("Lavagem Premium");
        servico.setDescricao("Lavagem completa + cera");
        servico.setValor(new BigDecimal("80.00"));
        servico.setDuracao(new BigDecimal("90"));
        servico.setDataCadastro(LocalDate.of(2024, 1, 15));

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(5L);
        lavaRapido.setRazaoSocial("Lava Jato Premium");
        servico.setLavaRapido(lavaRapido);

        List<Servico> servicos = List.of(servico);
        when(servicoRepository.findAll()).thenReturn(servicos);

        // Act
        List<ServicoListDTO> resultado = servicoService.listarPorRazaoSocialLavaRapido(null);

        // Assert
        assertEquals(1, resultado.size());
        ServicoListDTO dto = resultado.get(0);

        assertEquals(1L, dto.getId());
        assertEquals("Lavagem Premium", dto.getServico());
        assertEquals("Lavagem completa + cera", dto.getDescricao());
        assertEquals(new BigDecimal("80.00"), dto.getValor());
        assertEquals(new BigDecimal("90"), dto.getDuracao());
        assertEquals(LocalDate.of(2024, 1, 15), dto.getDataCadastro());
        assertEquals(5L, dto.getLavaRapidoId());
        assertEquals("Lava Jato Premium", dto.getLavaRapidoNome());
    }
}