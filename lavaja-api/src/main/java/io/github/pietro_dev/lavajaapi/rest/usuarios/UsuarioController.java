package io.github.pietro_dev.lavajaapi.rest.usuarios;

import io.github.pietro_dev.lavajaapi.model.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.services.UsuarioService;
import jakarta.validation.Valid;
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
    public ResponseEntity<UsuarioGetByIdResponseDTO> getUsuarioById(@PathVariable Long id){
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if(usuarioExistente.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        var usuario = usuarioExistente.map(UsuarioGetByIdResponseDTO::new).get();

        return ResponseEntity.ok(usuario);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,@RequestBody @Valid UsuarioUpdateRequest dto) {

        return usuarioService.atualizarUsuario(id, dto);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioUpdateRequestNoPassword data) {

        // Buscar usuário existente
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOptional.get();

        // Verificar se o email já existe em outro usuário
        Usuario usuarioComEmail = usuarioRepository.findUsuarioByEmail(data.email());
        if (usuarioComEmail != null && !usuarioComEmail.getId().equals(id)) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado em outro usuário!");
        }

        // Atualizar apenas os campos permitidos
        usuario.setNome(data.nome());
        usuario.setEmail(data.email());

        // Salvar as alterações
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
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
