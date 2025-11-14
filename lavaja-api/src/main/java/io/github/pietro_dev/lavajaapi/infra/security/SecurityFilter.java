package io.github.pietro_dev.lavajaapi.infra.security;

import io.github.pietro_dev.lavajaapi.model.UsuarioRole;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    TokenService tokenService;
    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    LavaRapidoRepository lavaRapidoRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // ✅ CORREÇÃO: Ignora rotas públicas - NÃO processa token para /auth/**
        if (request.getRequestURI().startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        var token = this.recoverToken(request);
        if(token != null) {
            try {
                var login = tokenService.validateToken(token);

                // 🔥 PRIMEIRO: Busca como Usuário
                UserDetails usuario = usuarioRepository.findByEmail(login);

                if(usuario != null) {
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("✅ Usuário autenticado: " + usuario.getUsername());
                } else {
                        // 🔥 SEGUNDO: Busca como Lava Rápido
                        var lavaRapidoEntidade = lavaRapidoRepository.findByEmail(login);

                        if(lavaRapidoEntidade != null) {
                            // 🔥 CONVERTE para UserDetails
                            UserDetails lavaRapido = criarUserDetails(
                                    lavaRapidoEntidade.getEmail(),
                                    lavaRapidoEntidade.getSenha(),
                                    lavaRapidoEntidade.getRole()
                            );

                            var authentication = new UsernamePasswordAuthenticationToken(lavaRapido, null, lavaRapido.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            System.out.println("✅ Lava Rápido autenticado: " + lavaRapido.getUsername());
                            System.out.println("🏪 ID do Lava Rápido: " + lavaRapidoEntidade.getId());
                        } else {
                            // 🔥 NENHUM ENCONTRADO
                            System.out.println("❌ Nenhum usuário ou lava rápido encontrado: " + login);
                        }
                }
            } catch (Exception e) {
                System.out.println("❌ Erro ao validar token: " + e.getMessage());
                // Continua sem autenticação
            }

        }
        filterChain.doFilter(request, response);

    }

    private UserDetails criarUserDetails(String email, String senha, UsuarioRole role) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password(senha)
                .roles(role.name())
                .build();
    }

    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null){
            return null;
        } else {
            return authHeader.replace("Bearer ", "");
        }
    }
}