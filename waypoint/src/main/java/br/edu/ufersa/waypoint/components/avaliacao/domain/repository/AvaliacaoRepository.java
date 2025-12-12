package br.edu.ufersa.waypoint.components.avaliacao.domain.repository;

import br.edu.ufersa.waypoint.components.avaliacao.domain.entities.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByLocalId(Long localId);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.local.id = :localId")
    Double getMediaNota(Long localId);
}