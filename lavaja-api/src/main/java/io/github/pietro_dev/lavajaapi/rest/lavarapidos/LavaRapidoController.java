package io.github.pietro_dev.lavajaapi.rest.lavarapidos;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.services.LavaRapidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lava-rapidos")
@CrossOrigin("*")
public class LavaRapidoController {

    @Autowired
    private LavaRapidoRepository lavaRapidoRepository;

    @Autowired
    private LavaRapidoService lavaRapidoService;

    @PostMapping
    public ResponseEntity salvar(@RequestBody LavaRapidoFormRequest request){
        LavaRapido lavaRapido = request.toModel();
        lavaRapidoRepository.save(lavaRapido);
        return ResponseEntity.ok(LavaRapidoFormRequest.fromModel(lavaRapido));
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> atualizar(@PathVariable Long id, @RequestBody LavaRapidoFormRequest request){
        Optional<LavaRapido> lavaRapidoExistente = lavaRapidoRepository.findById(id);
        if(lavaRapidoExistente.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        LavaRapido lavaRapido = request.toModel();
        lavaRapido.setId(id);
        lavaRapidoRepository.save(lavaRapido);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{id}")
    public ResponseEntity<LavaRapidoFormRequest> getById(@PathVariable Long id){
        return lavaRapidoRepository.findById(id)
                .map(LavaRapidoFormRequest::fromModel)
                .map(lavaRapidoFR -> ResponseEntity.ok(lavaRapidoFR))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id){
        return lavaRapidoRepository
                .findById(id)
                .map( lavaRapido -> {
                    lavaRapidoRepository.delete(lavaRapido);
                    return ResponseEntity.noContent().build();
                })
                .orElse( ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<LavaRapidoFormRequest> getLista(){
        return lavaRapidoRepository.findAll().stream().map(LavaRapidoFormRequest::fromModel).collect(Collectors.toList());
    }

    @GetMapping("/com-servicos")
    public ResponseEntity<List<LavaRapidoResponseDTO>> getListaComServicos() {
        List<LavaRapidoResponseDTO> lavaRapidos = lavaRapidoService.listarLavaRapidosComServico();
        return ResponseEntity.ok(lavaRapidos);
    }
}
