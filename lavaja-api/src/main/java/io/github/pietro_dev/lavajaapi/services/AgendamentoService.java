package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.Agendamento;
import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.Status;
import io.github.pietro_dev.lavajaapi.model.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.AgendamentoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.rest.agendamentos.AgendamentoAtualizarStatusDTO;
import io.github.pietro_dev.lavajaapi.rest.agendamentos.AgendamentoRequestDTO;
import io.github.pietro_dev.lavajaapi.rest.agendamentos.AgendamentoResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {
    @Autowired
    AgendamentoRepository agendamentoRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    ServicoRepository servicoRepository;



    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto){
        if(dto.getInicio() == null){
            throw new IllegalArgumentException("A data de início é obrigatória!");
        }

        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(()-> new RuntimeException("Serviço não encontrado!"));


        Long lavaRapidoId = servico.getLavaRapido().getId();

        Integer duracaoMinutos = servico.getDuracao() != null
                ? servico.getDuracao().intValue()
                : 30;

        LocalDateTime inicio = dto.getInicio();
        LocalDateTime fim = inicio.plusMinutes(duracaoMinutos);

        List<Agendamento> overlaps = agendamentoRepository.findOverlappingForLavaRapido(lavaRapidoId, inicio, fim);
        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Já existem agendamentos neste horário!");
        }


        if(inicio.isBefore(LocalDateTime.now())){
            throw new RuntimeException("Não é permitido criar agendamentos no passado");
        }

        // criando a entidade
        Agendamento agendamento = new Agendamento();

        agendamento.setServico(servico);
        agendamento.setLavaRapido(servico.getLavaRapido());

        if (dto.getUsuarioId() != null){
            Usuario u = usuarioRepository.findById(dto.getUsuarioId()).orElse(null);
            agendamento.setUsuario(u);
        }

        agendamento.setHoraInicio(inicio);
        agendamento.setDuracaoMinutos(duracaoMinutos);
        agendamento.setHoraFim(fim);
        agendamento.setValor(servico.getValor());
        agendamento.setStatus(Status.AGENDADO);


        Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);
        return new AgendamentoResponseDTO(agendamentoSalvo);
    }

    public List<AgendamentoResponseDTO> listar(){
        return agendamentoRepository.findAll().stream().map( AgendamentoResponseDTO :: new ).toList();
    }

    public AgendamentoResponseDTO buscar(Long id){
        return agendamentoRepository.findById(id).map( AgendamentoResponseDTO :: new )
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com ID: " + id));
    }

    public void deletar(Long id) {
        agendamentoRepository.deleteById(id);
    }

    public AgendamentoResponseDTO atualizar(Long id, AgendamentoAtualizarStatusDTO body){

        Agendamento agendamentoExistente = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        agendamentoExistente.setStatus(body.getStatus());
        agendamentoExistente.setHoraInicio(body.getInicio());

        LocalDateTime fim = body.getInicio().plusMinutes(agendamentoExistente.getDuracaoMinutos());

        agendamentoExistente.setHoraFim(fim);

        Agendamento agendamentoAtualizado = agendamentoRepository.save(agendamentoExistente);

        return new AgendamentoResponseDTO(agendamentoAtualizado);
    }

}
