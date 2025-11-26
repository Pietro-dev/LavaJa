package io.github.pietro_dev.lavajaapi.controller;

import io.github.pietro_dev.lavajaapi.dtos.agendamentos.AgendamentoAtualizarStatusDTO;
import io.github.pietro_dev.lavajaapi.dtos.agendamentos.AgendamentoRequestDTO;
import io.github.pietro_dev.lavajaapi.dtos.agendamentos.AgendamentoResponseDTO;
import io.github.pietro_dev.lavajaapi.model.entity.Agendamento;
import io.github.pietro_dev.lavajaapi.services.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/agendamentos")
@RestController
@CrossOrigin("*")
public class AgendamentoController {

    @Autowired
    AgendamentoService agendamentoService;


    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> salvar(@RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO response = agendamentoService.criarAgendamento(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listar(){
        return ResponseEntity.ok(agendamentoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> buscar(@PathVariable Long id){
        return ResponseEntity.ok(agendamentoService.buscar(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<AgendamentoResponseDTO>> getAgendamentosPorUsuario(@PathVariable Long usuarioId) {
        List<Agendamento> agendamentos = agendamentoService.buscarAgendamentosPorUsuario(usuarioId);
        List<AgendamentoResponseDTO> response = agendamentos.stream()
                .map(AgendamentoResponseDTO:: new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lavaRapido/{lavaRapidoId}")
    public ResponseEntity<List<AgendamentoResponseDTO>> getAgendamentosPorLavaRapidoId(@PathVariable Long lavaRapidoId) {
        List<Agendamento> agendamentos = agendamentoService.buscarAgendamentosPorLavaRapidoId(lavaRapidoId);
        List<AgendamentoResponseDTO> response = agendamentos.stream()
                .map(AgendamentoResponseDTO:: new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        agendamentoService.buscar(id);
        agendamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> atualizar(@PathVariable Long id, @RequestBody AgendamentoAtualizarStatusDTO body){
        return ResponseEntity.ok(agendamentoService.atualizar(id, body));
    }

}
