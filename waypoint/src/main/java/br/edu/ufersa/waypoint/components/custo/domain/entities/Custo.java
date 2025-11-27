package br.edu.ufersa.waypoint.components.custo.domain.entities;

import java.math.BigDecimal;


import br.edu.ufersa.waypoint.components.local.domain.entities.Local;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Custo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String description;
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Local location;
}
