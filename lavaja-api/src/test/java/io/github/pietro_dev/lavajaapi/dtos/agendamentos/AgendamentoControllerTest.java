package io.github.pietro_dev.lavajaapi.dtos.agendamentos;

import io.github.pietro_dev.lavajaapi.controller.AgendamentoController;
import io.github.pietro_dev.lavajaapi.model.entity.*;
import io.github.pietro_dev.lavajaapi.services.AgendamentoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AgendamentoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AgendamentoService agendamentoService;

    @InjectMocks
    private AgendamentoController agendamentoController;

    private ObjectMapper objectMapper;
    private AgendamentoRequestDTO agendamentoRequestDTO;
    private AgendamentoResponseDTO agendamentoResponseDTO;
    private AgendamentoAtualizarStatusDTO agendamentoAtualizarStatusDTO;
    private Agendamento agendamento;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(agendamentoController).build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        agendamentoRequestDTO = new AgendamentoRequestDTO();
        agendamentoRequestDTO.setServicoId(1L);
        agendamentoRequestDTO.setUsuarioId(1L);
        agendamentoRequestDTO.setInicio(LocalDateTime.of(2024, 1, 15, 10, 0));

        agendamentoResponseDTO = new AgendamentoResponseDTO();
        agendamentoResponseDTO.setId(1L);
        agendamentoResponseDTO.setInicio(LocalDateTime.of(2024, 1, 15, 10, 0));
        agendamentoResponseDTO.setFim(LocalDateTime.of(2024, 1, 15, 11, 0));
        agendamentoResponseDTO.setDuracaoMinutos(60);
        agendamentoResponseDTO.setValor(new BigDecimal("50.00"));
        agendamentoResponseDTO.setStatus("PENDENTE");
        agendamentoResponseDTO.setDataCriacao(LocalDate.of(2024, 1, 10));
        agendamentoResponseDTO.setServicoNome("Lavagem Completa");
        agendamentoResponseDTO.setLavaRapidoNome("Lava Rápido Express");
        agendamentoResponseDTO.setUsuarioNome("João Silva");
        agendamentoResponseDTO.setUsuarioId(1L);
        agendamentoResponseDTO.setServicoId(1L);
        agendamentoResponseDTO.setLavaRapidoId(1L);

        agendamentoAtualizarStatusDTO = new AgendamentoAtualizarStatusDTO();
        agendamentoAtualizarStatusDTO.setStatus(Status.FINALIZADO);

        agendamento = criarAgendamento();
    }

    private Agendamento criarAgendamento() {
        Agendamento ag = new Agendamento();
        ag.setId(1L);

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João Silva");
        ag.setUsuario(usuario);

        LavaRapido lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        lavaRapido.setRazaoSocial("Lava Rápido Express");
        ag.setLavaRapido(lavaRapido);

        Servico servico = new Servico();
        servico.setId(1L);
        servico.setServico("Lavagem Completa");
        ag.setServico(servico);

        ag.setHoraInicio(LocalDateTime.of(2024, 1, 15, 10, 0));
        ag.setHoraFim(LocalDateTime.of(2024, 1, 15, 11, 0));
        ag.setDuracaoMinutos(60);
        ag.setValor(new BigDecimal("50.00"));
        ag.setStatus(Status.AGENDADO);
        ag.setDataCriacao(LocalDate.of(2024, 1, 10));

        return ag;
    }

    @Test
    void salvar_ShouldReturnAgendamentoResponseDTO() throws Exception {
        // Arrange
        when(agendamentoService.criarAgendamento(any(AgendamentoRequestDTO.class)))
                .thenReturn(agendamentoResponseDTO);

        // Act & Assert
        mockMvc.perform(post("/api/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(agendamentoRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.valor").value(50.00))
                .andExpect(jsonPath("$.servicoNome").value("Lavagem Completa"))
                .andExpect(jsonPath("$.lavaRapidoNome").value("Lava Rápido Express"))
                .andExpect(jsonPath("$.usuarioNome").value("João Silva"));

        verify(agendamentoService, times(1)).criarAgendamento(any(AgendamentoRequestDTO.class));
    }

    @Test
    void listar_ShouldReturnListOfAgendamentoResponseDTO() throws Exception {
        // Arrange
        List<AgendamentoResponseDTO> agendamentos = Arrays.asList(agendamentoResponseDTO);
        when(agendamentoService.listar()).thenReturn(agendamentos);

        // Act & Assert
        mockMvc.perform(get("/api/agendamentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].status").value("PENDENTE"))
                .andExpect(jsonPath("$[0].servicoNome").value("Lavagem Completa"));

        verify(agendamentoService, times(1)).listar();
    }

    @Test
    void buscar_ShouldReturnAgendamentoResponseDTO() throws Exception {
        // Arrange
        Long id = 1L;
        when(agendamentoService.buscar(id)).thenReturn(agendamentoResponseDTO);

        // Act & Assert
        mockMvc.perform(get("/api/agendamentos/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.duracaoMinutos").value(60))
                .andExpect(jsonPath("$.servicoNome").value("Lavagem Completa"));

        verify(agendamentoService, times(1)).buscar(id);
    }

    @Test
    void getAgendamentosPorUsuario_ShouldReturnListOfAgendamentoResponseDTO() throws Exception {
        // Arrange
        Long usuarioId = 1L;
        List<Agendamento> agendamentos = Arrays.asList(agendamento);

        when(agendamentoService.buscarAgendamentosPorUsuario(usuarioId)).thenReturn(agendamentos);

        // Act & Assert
        mockMvc.perform(get("/api/agendamentos/usuario/{usuarioId}", usuarioId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].usuarioNome").value("João Silva"))
                .andExpect(jsonPath("$[0].servicoNome").value("Lavagem Completa"));

        verify(agendamentoService, times(1)).buscarAgendamentosPorUsuario(usuarioId);
    }

    @Test
    void getAgendamentosPorLavaRapidoId_ShouldReturnListOfAgendamentoResponseDTO() throws Exception {
        // Arrange
        Long lavaRapidoId = 1L;
        List<Agendamento> agendamentos = Arrays.asList(agendamento);

        when(agendamentoService.buscarAgendamentosPorLavaRapidoId(lavaRapidoId)).thenReturn(agendamentos);

        // Act & Assert
        mockMvc.perform(get("/api/agendamentos/lavaRapido/{lavaRapidoId}", lavaRapidoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].lavaRapidoNome").value("Lava Rápido Express"))
                .andExpect(jsonPath("$[0].servicoNome").value("Lavagem Completa"));

        verify(agendamentoService, times(1)).buscarAgendamentosPorLavaRapidoId(lavaRapidoId);
    }

    @Test
    void deletar_ShouldReturnNoContent() throws Exception {
        // Arrange
        Long id = 1L;
        when(agendamentoService.buscar(id)).thenReturn(agendamentoResponseDTO);
        doNothing().when(agendamentoService).deletar(id);

        // Act & Assert
        mockMvc.perform(delete("/api/agendamentos/{id}", id))
                .andExpect(status().isNoContent());

        verify(agendamentoService, times(1)).buscar(id);
        verify(agendamentoService, times(1)).deletar(id);
    }

    @Test
    void atualizar_ShouldReturnUpdatedAgendamentoResponseDTO() throws Exception {
        // Arrange
        Long id = 1L;

        // Criar response atualizado
        AgendamentoResponseDTO updatedResponse = new AgendamentoResponseDTO();
        updatedResponse.setId(1L);
        updatedResponse.setStatus("CONCLUIDO");
        updatedResponse.setServicoNome("Lavagem Completa");
        updatedResponse.setLavaRapidoNome("Lava Rápido Express");
        updatedResponse.setUsuarioNome("João Silva");

        when(agendamentoService.atualizar(eq(id), any(AgendamentoAtualizarStatusDTO.class)))
                .thenReturn(updatedResponse);

        // Act & Assert
        mockMvc.perform(put("/api/agendamentos/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(agendamentoAtualizarStatusDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONCLUIDO"));

        verify(agendamentoService, times(1)).atualizar(eq(id), any(AgendamentoAtualizarStatusDTO.class));
    }

    @Test
    void getAgendamentosPorUsuario_WhenNoAgendamentos_ShouldReturnEmptyList() throws Exception {
        // Arrange
        Long usuarioId = 2L;
        List<Agendamento> agendamentosVazios = Arrays.asList();

        when(agendamentoService.buscarAgendamentosPorUsuario(usuarioId)).thenReturn(agendamentosVazios);

        // Act & Assert
        mockMvc.perform(get("/api/agendamentos/usuario/{usuarioId}", usuarioId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(agendamentoService, times(1)).buscarAgendamentosPorUsuario(usuarioId);
    }
}