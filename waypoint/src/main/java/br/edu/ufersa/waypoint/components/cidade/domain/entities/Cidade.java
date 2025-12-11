package br.edu.ufersa.waypoint.components.cidade.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cidades")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long osmId; // ID do do OpenStreet/Nominatim

    private String nome;
    private String estado;
    private String pais;

    private Double latitude;
    private Double longitude;
}