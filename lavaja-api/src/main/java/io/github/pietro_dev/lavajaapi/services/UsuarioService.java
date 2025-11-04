package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoFormRequest;
import io.github.pietro_dev.lavajaapi.rest.usuarios.UsuarioFormRequest;
import io.github.pietro_dev.lavajaapi.rest.usuarios.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    public Usuario salvar(UsuarioFormRequest usuarioFormRequest){
        Usuario usuario = usuarioFormRequest.toModel();

        return usuarioRepository.save(usuario);
    }

//    public ResponseEntity<UsuarioResponseDTO> atualizar(Long id, Usuario usuarioAtualizado, Optional<Usuario> usuarioExistente) {
//        usuarioExistente.setId(id);
//        usuarioExistente.setNome(usuarioAtualizado.getNome());
//        usuarioExistente.setEmail(usuarioAtualizado.getEmail());
//        usuarioExistente.setSenha(usuarioAtualizado.getSenha());
//
//        UsuarioResponseDTO response = new UsuarioResponseDTO(usuarioExistente);
//
//        return ResponseEntity.ok(response);
//    }
}
