package br.edu.ufersa.waypoint;

import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import br.edu.ufersa.waypoint.components.usuario.domain.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class WaypointApplication {

	public static void main(String[] args) {
		SpringApplication.run(WaypointApplication.class, args);
	}

    @Bean
    CommandLineRunner init(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (repository.findByUsername("admin").isEmpty()) {
                Usuario u = new Usuario();
                u.setUsername("admin");
                u.setEmail("admin@waypoint.ufersa.edu.br");
                u.setRole("ROLE_ADMIN");
                u.setPassword(passwordEncoder.encode("123456"));

                repository.save(u);
                System.out.println("Usuário 'admin' criado com senha '123456'");
            }
        };
    }
}
