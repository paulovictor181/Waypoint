package br.edu.ufersa.waypoint.components.itinerario.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ufersa.waypoint.components.itinerario.domain.entities.Itinerario;

public interface ItinerarioRepository extends JpaRepository<Itinerario, Long> {
    List<Itinerario> findByUsuarioId(Long usuarioId);
}
