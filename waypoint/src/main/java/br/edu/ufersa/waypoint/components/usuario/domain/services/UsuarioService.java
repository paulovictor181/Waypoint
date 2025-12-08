package br.edu.ufersa.waypoint.components.usuario.domain.services;

import br.edu.ufersa.waypoint.auth.dtos.RegisterRequest;
import br.edu.ufersa.waypoint.components.usuario.api.mappers.UsuarioMapper;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import br.edu.ufersa.waypoint.components.usuario.domain.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository usuarioRepository;

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email não encontrado"));
    }

    @Transactional
    public Usuario register(RegisterRequest registerRequest) {
        Usuario usuario = UsuarioMapper.RequestToEntity(registerRequest);
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }


}
