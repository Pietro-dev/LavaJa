package io.github.pietro_dev.lavajaapi.rest.authentication;

import io.github.pietro_dev.lavajaapi.infra.security.TokenService;
import io.github.pietro_dev.lavajaapi.model.Usuario;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import io.github.pietro_dev.lavajaapi.rest.usuarios.LoginResponseDTO;
import io.github.pietro_dev.lavajaapi.rest.usuarios.UsuarioFormCadastroRequest;
import io.github.pietro_dev.lavajaapi.rest.usuarios.UsuarioFormLoginRequest;
import io.github.pietro_dev.lavajaapi.rest.usuarios.UsuarioFormRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid UsuarioFormLoginRequest data){
        var usuarioDataLogin = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usuarioDataLogin);
        var token = tokenService.generateToken((Usuario) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/cadastro")
    public ResponseEntity cadastro(@RequestBody @Valid UsuarioFormCadastroRequest data){
        if(usuarioRepository.findByEmail(data.email()) != null) return ResponseEntity.badRequest().body("E-mail já cadastrado!");

        String senhaCriptografada = new BCryptPasswordEncoder().encode(data.senha());

        Usuario newUsuario = new Usuario(data.nome(), data.email(), senhaCriptografada);

        usuarioRepository.save(newUsuario);

        return ResponseEntity.ok().build();
    }
}
