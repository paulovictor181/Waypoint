package br.edu.ufersa.waypoint.components.itinerario.api.dtos;

import br.edu.ufersa.waypoint.components.dia.api.dtos.DiaResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ItinerarioDetalhadoDTO(Long id, String name, LocalDate inicio, LocalDate fim, BigDecimal totalOrcamento, String s, Double aDouble, Double aDouble1, List<DiaResponseDTO> diasDTO) {

}
