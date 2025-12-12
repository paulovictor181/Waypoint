package br.edu.ufersa.waypoint.components.local.domain.entities;

import java.util.ArrayList;
import java.util.List;

import br.edu.ufersa.waypoint.components.avaliacao.domain.entities.Avaliacao;
import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import br.edu.ufersa.waypoint.components.dia.domain.entities.Dia;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
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
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long osmId;

    private String name;
    private Double latitude;
    private Double longitude;

    @ManyToMany(mappedBy = "locais")
    @JsonIgnore
    private List<Dia> dias = new ArrayList<>();

    @OneToMany(mappedBy = "local", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacoes = new ArrayList<>();

}
