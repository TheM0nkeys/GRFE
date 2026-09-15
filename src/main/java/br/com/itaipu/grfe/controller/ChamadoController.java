package br.com.itaipu.grfe.controller;

import br.com.itaipu.grfe.dto.request.ChamadoRequest;
import br.com.itaipu.grfe.dto.request.HistoricoAcionamentoRequest;
import br.com.itaipu.grfe.dto.response.ChamadoResponse;
import br.com.itaipu.grfe.dto.response.HistoricoAcionamentoResponse;
import br.com.itaipu.grfe.service.ChamadoService;
import br.com.itaipu.grfe.service.HistoricoAcionamentoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Chamados (Acionamentos)", description = "Registro e acompanhamento de acionamentos de sobreaviso")
@RestController
@RequestMapping("/chamados")
public class ChamadoController {

    private final ChamadoService chamadoService;
    private final HistoricoAcionamentoService historicoAcionamentoService;

    public ChamadoController(ChamadoService chamadoService,
                             HistoricoAcionamentoService historicoAcionamentoService) {
        this.chamadoService = chamadoService;
        this.historicoAcionamentoService = historicoAcionamentoService;
    }

    @GetMapping
    public ResponseEntity<List<ChamadoResponse>> listarTodos() {
        return ResponseEntity.ok(chamadoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChamadoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(chamadoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ChamadoResponse> criar(@RequestBody @Valid ChamadoRequest request) {
        return ResponseEntity.ok(chamadoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChamadoResponse> atualizar(@PathVariable Long id,
                                                     @RequestBody @Valid ChamadoRequest request) {
        return ResponseEntity.ok(chamadoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        chamadoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoAcionamentoResponse>> listarHistorico(@PathVariable Long id) {
        return ResponseEntity.ok(historicoAcionamentoService.listarPorChamado(id));
    }

    @PostMapping("/{id}/historico")
    public ResponseEntity<HistoricoAcionamentoResponse> registrarHistorico(
            @PathVariable Long id,
            @RequestBody @Valid HistoricoAcionamentoRequest request) {
        return ResponseEntity.ok(historicoAcionamentoService.registrar(id, request));
    }
}