package io.github.pietro_dev.lavajaapi.controller;

import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoFormRequest;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoResponseDTO;
import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import io.github.pietro_dev.lavajaapi.services.LavaRapidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lava-rapidos")
@CrossOrigin("*")
public class LavaRapidoController {

    @Autowired
    private LavaRapidoService lavaRapidoService;

    @PostMapping
    public ResponseEntity<Object> salvar(@Valid @RequestBody LavaRapidoFormRequest request) {
        try {
            LavaRapido lavaRapidoSalvo = lavaRapidoService.salvarLavaRapido(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(LavaRapidoFormRequest.fromModel(lavaRapidoSalvo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno no servidor");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody LavaRapidoFormRequest request) {
        try {
            lavaRapidoService.atualizarLavaRapido(id, request);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar lava-rápido");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LavaRapidoFormRequest> getById(@PathVariable Long id) {
        return lavaRapidoService.buscarPorId(id)
                .map(LavaRapidoFormRequest::fromModel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        try {
            lavaRapidoService.deletarLavaRapido(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao deletar lava-rápido");
        }
    }

    @GetMapping
    public List<LavaRapidoResponseDTO> getLista() {
        return lavaRapidoService.listarTodos();
    }

    @GetMapping("/com-servicos")
    public ResponseEntity<List<LavaRapidoResponseDTO>> getListaComServicos() {
        List<LavaRapidoResponseDTO> lavaRapidos = lavaRapidoService.listarLavaRapidosComServico();
        return ResponseEntity.ok(lavaRapidos);
    }

    // Novo endpoint para buscar por ID com serviços
    @GetMapping("/{id}/com-servicos")
    public ResponseEntity<LavaRapidoResponseDTO> getByIdComServicos(@PathVariable Long id) {
        try {
            LavaRapidoResponseDTO lavaRapido = lavaRapidoService.buscarPorIdComServicos(id);
            return ResponseEntity.ok(lavaRapido);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}