package br.edu.ufersa.waypoint.components.custo.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustoRepository extends JpaRepository<Custo, Long> {
    List<Custo> findByItinerarioId(Long itinerarioId);
    List<Custo> findByDiaIdAndLocalId(Long diaId, Long localId);
}
