package br.edu.ufersa.waypoint.components.itinerario.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import br.edu.ufersa.waypoint.components.common.Orcamentavel;
import br.edu.ufersa.waypoint.components.dia.domain.entities.Dia;
import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@Table(name = "itinerarios")
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Itinerario implements Orcamentavel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;

    @ManyToOne
    @JoinColumn(name = "cidade_id")
    private Cidade cidade;

    private BigDecimal totalOrcamento;

    private LocalDate inicio;
    private LocalDate fim;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "itinerario", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("numero ASC")
    private List<Dia> dias = new ArrayList<>();

    @Override
    public BigDecimal calcularCustoTotal() {
        if (this.dias == null || this.dias.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return this.dias.stream()
                .map(Orcamentavel::calcularCustoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
