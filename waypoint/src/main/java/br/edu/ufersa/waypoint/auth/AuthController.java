package br.edu.ufersa.waypoint.auth;

import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<String> authenticate(@Valid @RequestBody LoginDTO loginDTO) {
        var autenticationtoken = new UsernamePasswordAuthenticationToken(loginDTO.username(), loginDTO.password());
        var autentication = authenticationManager.authenticate(autenticationtoken);

        String tokenAcess= tokenService.generateToken((Usuario) autentication.getPrincipal());
        return ResponseEntity.ok(tokenAcess);
    }
}
