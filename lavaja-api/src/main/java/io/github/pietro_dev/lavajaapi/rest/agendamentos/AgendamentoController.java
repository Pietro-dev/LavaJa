package io.github.pietro_dev.lavajaapi.rest.agendamentos;

import io.github.pietro_dev.lavajaapi.services.AgendamentoService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
