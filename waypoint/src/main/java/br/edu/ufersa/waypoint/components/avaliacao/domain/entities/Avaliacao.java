package br.edu.ufersa.waypoint.components.avaliacao.domain.entities;

import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer nota;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(columnDefinition = "TEXT")
    private String fotoUrl;

    @ManyToOne
    @JoinColumn(name = "local_id")
    @JsonIgnore
    private Local local;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}