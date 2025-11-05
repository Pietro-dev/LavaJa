package io.github.pietro_dev.lavajaapi.rest.agendamentos;

import io.github.pietro_dev.lavajaapi.services.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/agendamentos")
@RestController
public class AgendamentoController {

    @Autowired
    AgendamentoService agendamentoService;


    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> salvar(@RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO response = agendamentoService.criarAgendamento(dto);
        System.out.println(response);
        return ResponseEntity.ok(response);
    }
}
