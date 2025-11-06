package io.github.pietro_dev.lavajaapi.rest.servicos;

import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.services.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin("*")
public class ServicoController {

    @Autowired
    ServicoRepository servicoRepository;
    @Autowired
    ServicoService servicoService;

    @PostMapping
    public ResponseEntity<Servico> salvar(@RequestBody ServicoFormRequest servicoFormRequest){
        Servico servico = servicoService.salvar(servicoFormRequest);

        return ResponseEntity.ok(servico);
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> atualizar(@PathVariable Long id, @RequestBody ServicoFormRequest servico){
        Optional<Servico> servicoExistente = servicoRepository.findById(id);
        if(servicoExistente.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        Servico entidadeServico = servico.toModel();
        entidadeServico.setId(id);
        entidadeServico.setDataCadastro(servico.getDataCadastro());
        servicoRepository.save(entidadeServico);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<ServicoListDTO>> listar(@RequestParam(required = false) String razaoSocial){
        System.out.println("filtro: " + razaoSocial);
        List<ServicoListDTO> lista = servicoService.listarPorRazaoSocialLavaRapido(razaoSocial);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("{id}")
    public ResponseEntity<ServicoFormRequest> getServicoById(@PathVariable Long id){
        Optional<Servico> servicoExistente = servicoRepository.findById(id);

        if(servicoExistente.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        var servico = servicoExistente.map(ServicoFormRequest::fromModel).get();

        return ResponseEntity.ok(servico);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        Optional<Servico> servicoExistente = servicoRepository.findById(id);

        if(servicoExistente.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        servicoRepository.delete(servicoExistente.get());

        return ResponseEntity.noContent().build();
    }
}
