package br.edu.ufersa.waypoint.components.itinerario.domain.entities;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import br.edu.ufersa.waypoint.components.usuario.domain.entities.Usuario;
import br.edu.ufersa.waypoint.components.local.domain.entities.Local;

import jakarta.persistence.*;

@Entity
public class Itinerario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private BigDecimal totalOrcamento;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "itinerario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Local> locais = new ArrayList<>();
}
