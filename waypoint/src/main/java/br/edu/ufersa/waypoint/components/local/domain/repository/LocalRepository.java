package br.edu.ufersa.waypoint.components.local.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufersa.waypoint.components.local.domain.entities.Local;

@Repository
public interface LocalRepository extends JpaRepository<Local, Long> {
}
