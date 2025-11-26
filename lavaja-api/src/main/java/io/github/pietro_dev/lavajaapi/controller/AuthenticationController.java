package io.github.pietro_dev.lavajaapi.controller;

import io.github.pietro_dev.lavajaapi.infra.security.TokenService;
import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.entity.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoFormRequest;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoLoginResponseDTO;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoResponseDTO;
import io.github.pietro_dev.lavajaapi.dtos.usuarios.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
//@CrossOrigin("*")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private LavaRapidoRepository lavaRapidoRepository;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid UsuarioFormLoginRequest data){
        var usuarioDataLogin = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usuarioDataLogin);
        var token = tokenService.generateToken((Usuario) auth.getPrincipal());

        Usuario usuario = usuarioRepository.findUsuarioOptByEmail(data.email()).orElse(null);

        return ResponseEntity.ok(new UsuarioLoginResponseDTO(token, usuario.getId()));
    }

    @PostMapping("/login/lava-rapidos")
    public ResponseEntity loginLavaRapido(@RequestBody @Valid UsuarioFormLoginRequest data) {
        try {
            System.out.println("Até aqui funcinou");
            // Busca diretamente no repositório de LavaRapido
            LavaRapido lavaRapido = lavaRapidoRepository.findLavaRapidoByEmail(data.email())
                    .orElseThrow(() -> new RuntimeException("Lava Rápido não encontrado!"));

            // Verifica a senha manualmente
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (!passwordEncoder.matches(data.senha(), lavaRapido.getSenha())) {
                return ResponseEntity.badRequest().body("Senha inválida!");
            }

            // Gera o token específico para LavaRapido
            var token = tokenService.generateLavaRapidoToken(lavaRapido);

            return ResponseEntity.ok(new LavaRapidoLoginResponseDTO(token, lavaRapido.getId()));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cadastro")
    public ResponseEntity cadastro(@RequestBody @Valid UsuarioFormCadastroRequest data){
        if(usuarioRepository.findByEmail(data.email()) != null) return ResponseEntity.badRequest().body("E-mail já cadastrado!");

        String senhaCriptografada = new BCryptPasswordEncoder().encode(data.senha());

        Usuario newUsuario = new Usuario(data.nome(), data.email(), senhaCriptografada, data.role());

        usuarioRepository.save(newUsuario);

        return ResponseEntity.ok(new UsuarioResponseDTO(newUsuario));
    }

    @PostMapping("/cadastro/lava-rapidos")
    public  ResponseEntity cadastroLavaRapido(@RequestBody @Valid LavaRapidoFormRequest data){
        if(lavaRapidoRepository.findByEmail(data.getEmail()) != null) return ResponseEntity.badRequest().body("E-mail já cadastrado!");

        String senhaCriptografada = new BCryptPasswordEncoder().encode(data.getSenha());
        data.setSenha(senhaCriptografada);
        LavaRapido newLavaRapido = new LavaRapido(data);

        lavaRapidoRepository.save(newLavaRapido);

        return ResponseEntity.ok(new LavaRapidoResponseDTO(newLavaRapido));
    }
}
