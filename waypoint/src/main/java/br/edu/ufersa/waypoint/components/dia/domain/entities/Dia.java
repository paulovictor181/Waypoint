package br.edu.ufersa.waypoint.components.dia.domain.entities;

import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer numero;

    @ManyToOne
    @JoinColumn(name = "itinerario_id")
    @JsonIgnore
    private Itinerario itinerario;

    @ManyToMany
    @JoinTable(
            name = "dia_locais",
            joinColumns = @JoinColumn(name = "dia_id"),
            inverseJoinColumns = @JoinColumn(name = "local_id")
    )
    private List<Local> locais = new ArrayList<>();
}