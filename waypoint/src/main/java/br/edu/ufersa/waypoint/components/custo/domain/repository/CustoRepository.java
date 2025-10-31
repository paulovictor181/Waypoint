package br.edu.ufersa.waypoint.components.custo.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;

public interface CustoRepository extends JpaRepository<Custo, Long> {

}
