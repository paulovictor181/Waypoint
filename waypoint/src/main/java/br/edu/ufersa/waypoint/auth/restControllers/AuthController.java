package br.edu.ufersa.waypoint.auth.restControllers;

import br.edu.ufersa.waypoint.auth.dtos.*;
import br.edu.ufersa.waypoint.auth.services.TokenService;
import br.edu.ufersa.waypoint.components.usuario.api.mappers.UsuarioMapper;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import br.edu.ufersa.waypoint.components.usuario.domain.repository.UsuarioRepository;
import br.edu.ufersa.waypoint.components.usuario.domain.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> authenticate(@Valid @RequestBody LoginDTO loginDTO) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.username(), loginDTO.password());
        var authentication = authenticationManager.authenticate(authenticationToken);

        String tokenAccess = tokenService.generateToken((Usuario) authentication.getPrincipal());
        String refreshToken = tokenService.generateRefreshToken((Usuario) authentication.getPrincipal());

        return ResponseEntity.ok(new TokenDTO(tokenAccess, refreshToken));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenDTO> updateToken(@Valid @RequestBody RefreshTokenDTO refreshTokenDTO) {
        var refreshToken = refreshTokenDTO.refreshToken();
        Long idUsuario = Long.valueOf(tokenService.verifyToken(refreshToken));
        var usuario = usuarioRepository.findById(idUsuario).orElseThrow();

        String tokenAccess = tokenService.generateToken(usuario);
        String updateRefreshToken = tokenService.generateRefreshToken(usuario);

        return ResponseEntity.ok(new TokenDTO(tokenAccess, updateRefreshToken));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        Usuario usuario = usuarioService.register(registerRequest);

        return ResponseEntity.ok(UsuarioMapper.EntityToResponse(usuario));
    }
}
