package io.github.pietro_dev.lavajaapi.rest.usuarios;

import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoFormRequest;
import io.github.pietro_dev.lavajaapi.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {
    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Usuario> salvar(@RequestBody UsuarioFormRequest usuarioFormRequest){
        Usuario usuario = usuarioService.salvar(usuarioFormRequest);

        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios(){
        return usuarioRepository.findAll().stream().map( UsuarioResponseDTO :: new ).collect(Collectors.toList());
    }

    @GetMapping("{id}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioById(@PathVariable Long id){
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if(usuarioExistente.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        var usuario = usuarioExistente.map(UsuarioResponseDTO::new).get();

        return ResponseEntity.ok(usuario);
    }

    @PutMapping("{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody UsuarioFormRequest usuarioAtualizado){
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if (usuarioExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }else {
            Usuario usuario = usuarioAtualizado.toModel();
            usuario.setId(id);
            usuario.setDataCadastro(usuarioExistente.get().getDataCadastro());
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id){
        return usuarioRepository
                .findById(id)
                .map( usuario -> {
                usuarioRepository.delete(usuario);
                return ResponseEntity.noContent().build();
            })
                .orElse(ResponseEntity.notFound().build());
    }
}
