package io.github.pietro_dev.lavajaapi.rest.servicos;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.services.ServicoService;
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
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ServicoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ServicoRepository servicoRepository;

    @Mock
    private ServicoService servicoService;

    @InjectMocks
    private ServicoController servicoController;

    private ObjectMapper objectMapper;
    private Servico servico;
    private ServicoFormRequest servicoFormRequest;
    private ServicoListDTO servicoListDTO;
    private ServicoResponseDTO servicoResponseDTO;
    private LavaRapido lavaRapido;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(servicoController).build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        // Configurar LavaRapido
        lavaRapido = new LavaRapido();
        lavaRapido.setId(1L);
        lavaRapido.setRazaoSocial("Lava Rápido Express");

        // Configurar Servico
        servico = new Servico();
        servico.setId(1L);
        servico.setServico("Lavagem Completa");
        servico.setDescricao("Lavagem interna e externa completa");
        servico.setValor(new BigDecimal("50.00"));
        servico.setDuracao(new BigDecimal("60"));
        servico.setDataCadastro(LocalDate.of(2024, 1, 10));
        servico.setLavaRapido(lavaRapido);

        // Configurar ServicoFormRequest
        servicoFormRequest = new ServicoFormRequest();
        servicoFormRequest.setServico("Lavagem Completa");
        servicoFormRequest.setDescricao("Lavagem interna e externa completa");
        servicoFormRequest.setValor(new BigDecimal("50.00"));
        servicoFormRequest.setDuracao(new BigDecimal("60"));
        servicoFormRequest.setLavaRapidoId(1L);

        // Configurar ServicoListDTO
        servicoListDTO = new ServicoListDTO(
                1L, "Lavagem Completa", "Lavagem interna e externa completa",
                new BigDecimal("50.00"), new BigDecimal("60"),
                LocalDate.of(2024, 1, 10), 1L, "Lava Rápido Express"
        );

        // Configurar ServicoResponseDTO
        servicoResponseDTO = new ServicoResponseDTO(
                1L, "Lavagem Completa", "Lavagem interna e externa completa",
                new BigDecimal("50.00"), new BigDecimal("60"),
                LocalDate.of(2024, 1, 10)
        );
    }

    @Test
    void salvar_ShouldReturnServico() throws Exception {
        // Arrange
        when(servicoService.salvar(any(ServicoFormRequest.class))).thenReturn(servico);

        // Act & Assert
        mockMvc.perform(post("/api/servicos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(servicoFormRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.servico").value("Lavagem Completa"))
                .andExpect(jsonPath("$.valor").value(50.00));

        verify(servicoService, times(1)).salvar(any(ServicoFormRequest.class));
    }

    @Test
    void atualizar_WhenServicoExists_ShouldReturnOk() throws Exception {
        // Arrange
        Long id = 1L;
        when(servicoRepository.findById(id)).thenReturn(Optional.of(servico));
        when(servicoRepository.save(any(Servico.class))).thenReturn(servico);

        // Act & Assert
        mockMvc.perform(put("/api/servicos/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(servicoFormRequest)))
                .andExpect(status().isOk());

        verify(servicoRepository, times(1)).findById(id);
        verify(servicoRepository, times(1)).save(any(Servico.class));
    }

    @Test
    void atualizar_WhenServicoDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Arrange
        Long id = 999L;
        when(servicoRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(put("/api/servicos/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(servicoFormRequest)))
                .andExpect(status().isNotFound());

        verify(servicoRepository, times(1)).findById(id);
        verify(servicoRepository, never()).save(any(Servico.class));
    }

    @Test
    void listar_WithoutFilter_ShouldReturnAllServicos() throws Exception {
        // Arrange
        List<ServicoListDTO> servicos = Arrays.asList(servicoListDTO);
        when(servicoService.listarPorRazaoSocialLavaRapido(null)).thenReturn(servicos);

        // Act & Assert
        mockMvc.perform(get("/api/servicos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].servico").value("Lavagem Completa"))
                .andExpect(jsonPath("$[0].lavaRapidoNome").value("Lava Rápido Express"));

        verify(servicoService, times(1)).listarPorRazaoSocialLavaRapido(null);
    }

    @Test
    void listar_WithFilter_ShouldReturnFilteredServicos() throws Exception {
        // Arrange
        String razaoSocial = "Express";
        List<ServicoListDTO> servicos = Arrays.asList(servicoListDTO);
        when(servicoService.listarPorRazaoSocialLavaRapido(razaoSocial)).thenReturn(servicos);

        // Act & Assert
        mockMvc.perform(get("/api/servicos")
                        .param("razaoSocial", razaoSocial))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].lavaRapidoNome").value("Lava Rápido Express"));

        verify(servicoService, times(1)).listarPorRazaoSocialLavaRapido(razaoSocial);
    }

    @Test
    void getServicoById_WhenServicoExists_ShouldReturnServicoFormRequest() throws Exception {
        // Arrange
        Long id = 1L;
        when(servicoRepository.findById(id)).thenReturn(Optional.of(servico));

        // Act & Assert
        mockMvc.perform(get("/api/servicos/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.servico").value("Lavagem Completa"))
                .andExpect(jsonPath("$.lavaRapidoId").value(1L));

        verify(servicoRepository, times(1)).findById(id);
    }

    @Test
    void getServicoById_WhenServicoDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Arrange
        Long id = 999L;
        when(servicoRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/servicos/{id}", id))
                .andExpect(status().isNotFound());

        verify(servicoRepository, times(1)).findById(id);
    }

    @Test
    void listarServicosPorLavaRapidoId_WhenServicosExist_ShouldReturnList() throws Exception {
        // Arrange
        Long lavaRapidoId = 1L;
        List<Servico> servicos = Arrays.asList(servico);
        when(servicoService.findByLavaRapidoId(lavaRapidoId)).thenReturn(servicos);

        // Act & Assert
        mockMvc.perform(get("/api/servicos/{lavaRapidoId}/servicos", lavaRapidoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].servico").value("Lavagem Completa"));

        verify(servicoService, times(1)).findByLavaRapidoId(lavaRapidoId);
    }

    @Test
    void listarServicosPorLavaRapidoId_WhenNoServicos_ShouldReturnEmptyList() throws Exception {
        // Arrange
        Long lavaRapidoId = 2L;
        when(servicoService.findByLavaRapidoId(lavaRapidoId)).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/api/servicos/{lavaRapidoId}/servicos", lavaRapidoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(servicoService, times(1)).findByLavaRapidoId(lavaRapidoId);
    }

    @Test
    void deletar_WhenServicoExists_ShouldReturnNoContent() throws Exception {
        // Arrange
        Long id = 1L;
        when(servicoRepository.findById(id)).thenReturn(Optional.of(servico));
        doNothing().when(servicoRepository).delete(servico);

        // Act & Assert
        mockMvc.perform(delete("/api/servicos/{id}", id))
                .andExpect(status().isNoContent());

        verify(servicoRepository, times(1)).findById(id);
        verify(servicoRepository, times(1)).delete(servico);
    }

    @Test
    void deletar_WhenServicoDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Arrange
        Long id = 999L;
        when(servicoRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(delete("/api/servicos/{id}", id))
                .andExpect(status().isNotFound());

        verify(servicoRepository, times(1)).findById(id);
        verify(servicoRepository, never()).delete(any(Servico.class));
    }


    @Test
    void listar_WhenServiceReturnsEmptyList_ShouldReturnEmptyArray() throws Exception {
        // Arrange
        when(servicoService.listarPorRazaoSocialLavaRapido(null)).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/api/servicos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(servicoService, times(1)).listarPorRazaoSocialLavaRapido(null);
    }
}