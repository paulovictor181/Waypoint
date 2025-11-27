package br.edu.ufersa.waypoint.components.custo.domain.service;

import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import br.edu.ufersa.waypoint.components.custo.domain.repository.CustoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustoService {

    private final CustoRepository custoRepository;

    public List<Custo> findAll() {
        return custoRepository.findAll();
    }

    public Custo findById(long id) {
        return custoRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Custo não encontrado com id: " + id));
    }

    @Transactional
    public Custo save(Custo custo) {
        return custoRepository.save(custo);
    }

    @Transactional
    public Custo update(long id, Custo custoAtualizado) {
        Custo custoExistente = findById(id);

        custoAtualizado.setId(custoExistente.getId());

        return custoRepository.save(custoAtualizado);
    }

    @Transactional
    public void delete(long id) {
        if (!custoRepository.existsById(id)) {
            throw new EntityNotFoundException("Custo não encontrado com id: " + id);
        }
        custoRepository.deleteById(id);
    }
}
