package br.edu.ufersa.waypoint.components.dia.domain.entities;

import br.edu.ufersa.waypoint.components.common.Orcamentavel;
import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dia implements Orcamentavel {
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

    @OneToMany(mappedBy = "dia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Custo> custos = new ArrayList<>();

    @Override
    public BigDecimal calcularCustoTotal() {
        if (this.custos == null || this.custos.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return this.custos.stream()
                .map(Orcamentavel::calcularCustoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}