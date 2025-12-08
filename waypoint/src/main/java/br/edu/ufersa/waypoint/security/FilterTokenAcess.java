package br.edu.ufersa.waypoint.security;

import br.edu.ufersa.waypoint.auth.services.TokenService;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import br.edu.ufersa.waypoint.components.usuario.domain.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class FilterTokenAcess extends OncePerRequestFilter {


    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Recuperar o token da requisição
        String token = recoverTokenRequest(request);

        if( token != null ) {
            String username = tokenService.verifyToken(token);
            Usuario usuario = usuarioRepository.findByUsername(username).orElseThrow(RuntimeException::new);

            Authentication authentication = new UsernamePasswordAuthenticationToken(usuario,null,usuario.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String recoverTokenRequest(HttpServletRequest request) {
        var authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.replace("Bearer ", "");
        }

        return null;
    }
}
