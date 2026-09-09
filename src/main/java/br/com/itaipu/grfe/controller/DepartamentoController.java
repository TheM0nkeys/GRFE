package br.com.itaipu.grfe.controller;

import br.com.itaipu.grfe.dto.request.DepartamentoRequest;
import br.com.itaipu.grfe.dto.response.DepartamentoResponse;
import br.com.itaipu.grfe.service.DepartamentoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departamentos")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @GetMapping
    public ResponseEntity<List<DepartamentoResponse>> listarTodos() {
        return ResponseEntity.ok(departamentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartamentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(departamentoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<DepartamentoResponse> criar(@RequestBody @Valid DepartamentoRequest request) {
        return ResponseEntity.ok(departamentoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartamentoResponse> atualizar(@PathVariable Long id,
                                                          @RequestBody @Valid DepartamentoRequest request) {
        return ResponseEntity.ok(departamentoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        departamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}