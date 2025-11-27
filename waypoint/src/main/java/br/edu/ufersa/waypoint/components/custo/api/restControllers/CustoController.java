package br.edu.ufersa.waypoint.components.custo.api.restControllers;

import br.edu.ufersa.waypoint.components.custo.domain.entities.Custo;
import br.edu.ufersa.waypoint.components.custo.domain.service.CustoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/cost")
@RequiredArgsConstructor
public class CustoController {

    private final CustoService custoService;

    @GetMapping
    public ResponseEntity<List<Custo>> findAll() {
        return ResponseEntity.ok(custoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Custo> findById(@PathVariable long id) {
        return ResponseEntity.ok(custoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Custo> create(@RequestBody Custo custo) {
        Custo novoCusto = custoService.save(custo);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCusto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Custo> update(@PathVariable long id, @RequestBody Custo custo) {
        return ResponseEntity.ok(custoService.update(id, custo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        custoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
