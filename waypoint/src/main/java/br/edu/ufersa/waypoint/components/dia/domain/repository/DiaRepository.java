package br.edu.ufersa.waypoint.components.dia.domain.repository;

import br.edu.ufersa.waypoint.components.dia.domain.entities.Dia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiaRepository extends JpaRepository<Dia, Long> {
    Optional<Dia> findByItinerarioIdAndNumero(Long itinerarioId, Integer numero);
}
