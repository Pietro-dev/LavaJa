package io.github.pietro_dev.lavajaapi.rest.servicos;

import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.services.ServicoService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;
import java.util.function.Function;
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
    public List<ServicoFormRequest> getServicos(){
//        try {
//            Thread.sleep(1500);
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }
        return servicoRepository.findAll().stream().map( ServicoFormRequest::fromModel ).collect(Collectors.toList());
    }

    @GetMapping("{id}")
    public ResponseEntity<ServicoFormRequest> getProdutoById(@PathVariable Long id){
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
