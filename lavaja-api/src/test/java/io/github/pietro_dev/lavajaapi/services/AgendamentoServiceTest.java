package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.entity.Agendamento;
import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.entity.Servico;
import io.github.pietro_dev.lavajaapi.model.entity.Status;
import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.AgendamentoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.dtos.agendamentos.AgendamentoRequestDTO;
import io.github.pietro_dev.lavajaapi.dtos.agendamentos.AgendamentoResponseDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgendamentoServiceTest {

    @Mock
    private AgendamentoRepository agendamentoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ServicoRepository servicoRepository;

    @InjectMocks
    private AgendamentoService agendamentoService;

    @Test
    void deveCriarAgendamentoComSucesso() {
        // Arrange
        LocalDateTime inicio = LocalDateTime.now().plusHours(1);
        AgendamentoRequestDTO dto = new AgendamentoRequestDTO();
        dto.setServicoId(1L);
        dto.setUsuarioId(1L);
        dto.setInicio(inicio);

        Servico servico = new Servico();
        servico.setId(1L);
        servico.setValor(new BigDecimal("50.00"));
        servico.setDuracao(new BigDecimal("60"));

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        servico.setLavaRapido(lavaRapido);

        Usuario usuario = new Usuario();
        usuario.setId(1L);

        Agendamento agendamentoSalvo = new Agendamento();
        agendamentoSalvo.setId(1L);
        agendamentoSalvo.setStatus(Status.AGENDADO);

        when(servicoRepository.findById(1L)).thenReturn(Optional.of(servico));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(agendamentoRepository.findOverlappingForLavaRapido(anyLong(), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of());
        when(agendamentoRepository.save(any(Agendamento.class))).thenReturn(agendamentoSalvo);

        // Act
        AgendamentoResponseDTO resultado = agendamentoService.criarAgendamento(dto);

        // Assert
        assertNotNull(resultado);
        verify(servicoRepository, times(1)).findById(1L);
        verify(usuarioRepository, times(1)).findById(1L);
        verify(agendamentoRepository, times(1)).save(any(Agendamento.class));
    }

    @Test
    void deveLancarExcecaoQuandoDataInicioForNula() {
        // Arrange
        AgendamentoRequestDTO dto = new AgendamentoRequestDTO();
        dto.setServicoId(1L);
        dto.setInicio(null); // Data nula

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> agendamentoService.criarAgendamento(dto)
        );

        assertEquals("A data de início é obrigatória!", exception.getMessage());
        verify(servicoRepository, never()).findById(anyLong());
    }

    @Test
    void deveLancarExcecaoQuandoServicoNaoExiste() {
        // Arrange
        LocalDateTime inicio = LocalDateTime.now().plusHours(1);
        AgendamentoRequestDTO dto = new AgendamentoRequestDTO();
        dto.setServicoId(999L); // ID inexistente
        dto.setInicio(inicio);

        when(servicoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> agendamentoService.criarAgendamento(dto)
        );

        assertEquals("Serviço não encontrado!", exception.getMessage());
        verify(servicoRepository, times(1)).findById(999L);
    }

    @Test
    void deveLancarExcecaoQuandoHaConflitoDeHorario() {
        // Arrange
        LocalDateTime inicio = LocalDateTime.now().plusHours(1);
        AgendamentoRequestDTO dto = new AgendamentoRequestDTO();
        dto.setServicoId(1L);
        dto.setInicio(inicio);

        Servico servico = new Servico();
        servico.setId(1L);
        servico.setDuracao(new BigDecimal("60"));

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        servico.setLavaRapido(lavaRapido);

        Agendamento agendamentoConflitante = new Agendamento();

        when(servicoRepository.findById(1L)).thenReturn(Optional.of(servico));
        when(agendamentoRepository.findOverlappingForLavaRapido(anyLong(), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(agendamentoConflitante));

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> agendamentoService.criarAgendamento(dto)
        );

        assertEquals("Já existem agendamentos neste horário!", exception.getMessage());
    }

    @Test
    void deveLancarExcecaoQuandoDataNoPassado() {
        // Arrange
        LocalDateTime inicioPassado = LocalDateTime.now().minusHours(1);
        AgendamentoRequestDTO dto = new AgendamentoRequestDTO();
        dto.setServicoId(1L);
        dto.setInicio(inicioPassado);

        Servico servico = new Servico();
        servico.setId(1L);
        servico.setDuracao(new BigDecimal("60"));

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        servico.setLavaRapido(lavaRapido);

        when(servicoRepository.findById(1L)).thenReturn(Optional.of(servico));
        when(agendamentoRepository.findOverlappingForLavaRapido(anyLong(), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> agendamentoService.criarAgendamento(dto)
        );

        assertEquals("Não é permitido criar agendamentos no passado", exception.getMessage());
    }

    @Test
    void deveLancarExcecaoAoBuscarAgendamentoInexistente() {
        // Arrange
        Long agendamentoId = 999L;
        when(agendamentoRepository.findById(agendamentoId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> agendamentoService.buscar(agendamentoId)
        );

        assertEquals("Agendamento não encontrado com ID: 999", exception.getMessage());
        verify(agendamentoRepository, times(1)).findById(agendamentoId);
    }

    @Test
    void deveDeletarAgendamento() {
        // Arrange
        Long agendamentoId = 1L;
        doNothing().when(agendamentoRepository).deleteById(agendamentoId);

        // Act
        agendamentoService.deletar(agendamentoId);

        // Assert
        verify(agendamentoRepository, times(1)).deleteById(agendamentoId);
    }

    @Test
    void deveBuscarAgendamentosPorUsuario() {
        // Arrange
        Long usuarioId = 1L;
        Agendamento agendamento1 = new Agendamento();
        Agendamento agendamento2 = new Agendamento();
        List<Agendamento> agendamentos = Arrays.asList(agendamento1, agendamento2);

        when(agendamentoRepository.findAgendamentosPorUsuario(usuarioId)).thenReturn(agendamentos);

        // Act
        List<Agendamento> resultado = agendamentoService.buscarAgendamentosPorUsuario(usuarioId);

        // Assert
        assertEquals(2, resultado.size());
        verify(agendamentoRepository, times(1)).findAgendamentosPorUsuario(usuarioId);
    }

    @Test
    void deveBuscarAgendamentosPorLavaRapido() {
        // Arrange
        Long lavaRapidoId = 1L;
        Agendamento agendamento1 = new Agendamento();
        Agendamento agendamento2 = new Agendamento();
        List<Agendamento> agendamentos = Arrays.asList(agendamento1, agendamento2);

        when(agendamentoRepository.findAgendamentosPorLavaRapido(lavaRapidoId)).thenReturn(agendamentos);

        // Act
        List<Agendamento> resultado = agendamentoService.buscarAgendamentosPorLavaRapidoId(lavaRapidoId);

        // Assert
        assertEquals(2, resultado.size());
        verify(agendamentoRepository, times(1)).findAgendamentosPorLavaRapido(lavaRapidoId);
    }
}