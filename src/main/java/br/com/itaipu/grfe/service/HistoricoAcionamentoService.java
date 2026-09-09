package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.HistoricoAcionamentoRequest;
import br.com.itaipu.grfe.dto.response.HistoricoAcionamentoResponse;
import br.com.itaipu.grfe.entity.Chamado;
import br.com.itaipu.grfe.entity.Funcionario;
import br.com.itaipu.grfe.entity.HistoricoAcionamento;
import br.com.itaipu.grfe.repository.ChamadoRepository;
import br.com.itaipu.grfe.repository.FuncionarioRepository;
import br.com.itaipu.grfe.repository.HistoricoAcionamentoRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class HistoricoAcionamentoService {

    private final HistoricoAcionamentoRepository historicoAcionamentoRepository;
    private final ChamadoRepository chamadoRepository;
    private final FuncionarioRepository funcionarioRepository;

    public HistoricoAcionamentoService(HistoricoAcionamentoRepository historicoAcionamentoRepository,
                                       ChamadoRepository chamadoRepository,
                                       FuncionarioRepository funcionarioRepository) {
        this.historicoAcionamentoRepository = historicoAcionamentoRepository;
        this.chamadoRepository = chamadoRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<HistoricoAcionamentoResponse> listarPorChamado(Long chamadoId) {
        Chamado chamado = buscarChamado(chamadoId);
        return chamado.getHistorico()
                .stream()
                .sorted(Comparator.comparing(HistoricoAcionamento::getDataHora))
                .map(HistoricoAcionamentoResponse::fromEntity)
                .toList();
    }

    public HistoricoAcionamentoResponse registrar(Long chamadoId, HistoricoAcionamentoRequest request) {
        Chamado chamado = buscarChamado(chamadoId);

        Funcionario autor = funcionarioRepository.findById(request.autorId())
                .orElseThrow(() -> new IllegalArgumentException("Autor não encontrado: " + request.autorId()));

        HistoricoAcionamento historico = request.toEntity();
        historico.setAutor(autor);
        historico.setChamado(chamado);

        return HistoricoAcionamentoResponse.fromEntity(historicoAcionamentoRepository.save(historico));
    }

    private Chamado buscarChamado(Long chamadoId) {
        return chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new IllegalArgumentException("Acionamento não encontrado: " + chamadoId));
    }
}
