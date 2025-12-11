package br.edu.ufersa.waypoint.components.local.domain.entities;

import java.util.ArrayList;
import java.util.List;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "itinerario_id")
    private Itinerario itinerario;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Custo> custos = new ArrayList<>();
}
