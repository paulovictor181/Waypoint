package br.edu.ufersa.waypoint.components.cidade.domain.repository;

import br.edu.ufersa.waypoint.components.cidade.domain.entities.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CidadeRepository extends JpaRepository<Cidade, Long> {
    Optional<Cidade> findByOsmId(Long osmId);
}