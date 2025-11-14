package io.github.pietro_dev.lavajaapi.rest.lavarapidos;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.services.LavaRapidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.beans.Encoder;
import java.time.LocalDateTime;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<Object> salvar(@Valid @RequestBody LavaRapidoFormRequest request) {
        try {
            // Validação de email único
            if (lavaRapidoRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body("Já existe um lava-rápido cadastrado com este email: " + request.getEmail());
            }

            LavaRapido lavaRapido = request.toModel();
            lavaRapido.setSenha(passwordEncoder.encode(request.getSenha()));

            LavaRapido lavaRapidoSalvo = lavaRapidoRepository.save(lavaRapido);
            return ResponseEntity.status(HttpStatus.CREATED).body(LavaRapidoFormRequest.fromModel(lavaRapidoSalvo));

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body("Erro interno no servidor");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizar(@PathVariable Long id, @RequestBody LavaRapidoFormRequest request) {
        Optional<LavaRapido> lavaRapidoExistente = lavaRapidoRepository.findById(id);
        if (lavaRapidoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        LavaRapido lavaRapidoAtual = lavaRapidoExistente.get();
        LavaRapido lavaRapidoNovo = request.toModel();

        // Atualiza todos os campos exceto a senha (se estiver vazia ou null)
        lavaRapidoAtual.setRazaoSocial(lavaRapidoNovo.getRazaoSocial());
        lavaRapidoAtual.setCnpj(lavaRapidoNovo.getCnpj());
        lavaRapidoAtual.setEndereco(lavaRapidoNovo.getEndereco());
        lavaRapidoAtual.setTelefone(lavaRapidoNovo.getTelefone());
        lavaRapidoAtual.setEmail(lavaRapidoNovo.getEmail());

        // Só atualiza a senha se foi fornecida uma nova
        if (lavaRapidoNovo.getSenha() != null && !lavaRapidoNovo.getSenha().trim().isEmpty()) {
            lavaRapidoAtual.setSenha(lavaRapidoNovo.getSenha());
        }

        lavaRapidoRepository.save(lavaRapidoAtual);
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
    public List<LavaRapidoResponseDTO> getLista(){
        return lavaRapidoRepository.findAll().stream().map(LavaRapidoResponseDTO::new).collect(Collectors.toList());
    }

    @GetMapping("/com-servicos")
    public ResponseEntity<List<LavaRapidoResponseDTO>> getListaComServicos() {
        List<LavaRapidoResponseDTO> lavaRapidos = lavaRapidoService.listarLavaRapidosComServico();
        return ResponseEntity.ok(lavaRapidos);
    }
}
