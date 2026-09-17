package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.ChamadoRequest;
import br.com.itaipu.grfe.dto.response.ChamadoResponse;
import br.com.itaipu.grfe.entity.Chamado;
import br.com.itaipu.grfe.entity.Especialidades;
import br.com.itaipu.grfe.entity.Funcionario;
import br.com.itaipu.grfe.entity.enums.StatusChamado;
import br.com.itaipu.grfe.exception.EntidadeNaoEncontradaException;
import br.com.itaipu.grfe.repository.ChamadoRepository;
import br.com.itaipu.grfe.repository.EspecialidadesRepository;
import br.com.itaipu.grfe.repository.FuncionarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ChamadoService {

    private static final Logger log = LoggerFactory.getLogger(ChamadoService.class);

    private final ChamadoRepository chamadoRepository;
    private final EspecialidadesRepository especialidadesRepository;
    private final FuncionarioRepository funcionarioRepository;

    public ChamadoService(ChamadoRepository chamadoRepository,
                          EspecialidadesRepository especialidadesRepository,
                          FuncionarioRepository funcionarioRepository) {
        this.chamadoRepository = chamadoRepository;
        this.especialidadesRepository = especialidadesRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<ChamadoResponse> listarTodos() {
        return chamadoRepository.findAll()
                .stream()
                .map(ChamadoResponse::fromEntity)
                .toList();
    }

    public List<ChamadoResponse> listarPorStatus(StatusChamado status) {
        log.info("Listando acionamentos filtrados por status={}", status);
        return chamadoRepository.findByStatus(status)
                .stream()
                .map(ChamadoResponse::fromEntity)
                .toList();
    }

    public ChamadoResponse buscarPorId(Long id) {
        return ChamadoResponse.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public ChamadoResponse atualizarStatus(Long id, StatusChamado status) {
        Chamado chamado = buscarEntidadePorId(id);
        StatusChamado statusAnterior = chamado.getStatus();
        chamado.setStatus(status);
        chamado = chamadoRepository.save(chamado);
        log.info("Status do acionamento alterado: id={}, statusAnterior={}, statusNovo={}",
                id, statusAnterior, status);
        return ChamadoResponse.fromEntity(chamado);
    }

    @Transactional
    public ChamadoResponse criar(ChamadoRequest request) {
        Chamado chamado = request.toEntity();
        vincularRelacoes(chamado, request);
        chamado = chamadoRepository.save(chamado);
        log.info("Acionamento criado: id={}, especialidadeId={}, plantonistaId={}, numeroIncidente={}",
                chamado.getId(), request.especialidadeId(), request.plantonistaId(), request.numeroIncidente());
        return ChamadoResponse.fromEntity(chamado);
    }

    @Transactional
    public ChamadoResponse atualizar(Long id, ChamadoRequest request) {
        Chamado chamado = buscarEntidadePorId(id);
        chamado.setDataHoraAcionamento(request.dataHoraAcionamento());
        chamado.setMotivo(request.motivo());
        chamado.setNumeroIncidente(request.numeroIncidente());
        chamado.setStatus(request.status());
        vincularRelacoes(chamado, request);
        chamado = chamadoRepository.save(chamado);
        log.info("Acionamento atualizado: id={}, status={}", id, request.status());
        return ChamadoResponse.fromEntity(chamado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!chamadoRepository.existsById(id)) {
            log.warn("Tentativa de excluir acionamento inexistente: id={}", id);
            throw new EntidadeNaoEncontradaException("Acionamento não encontrado: " + id);
        }
        chamadoRepository.deleteById(id);
        log.info("Acionamento removido: id={}", id);
    }

    private Chamado buscarEntidadePorId(Long id) {
        return chamadoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Acionamento não encontrado: id={}", id);
                    return new EntidadeNaoEncontradaException("Acionamento não encontrado: " + id);
                });
    }

    private void vincularRelacoes(Chamado chamado, ChamadoRequest request) {
        Especialidades especialidade = especialidadesRepository.findById(request.especialidadeId())
                .orElseThrow(() -> {
                    log.warn("Especialidade não encontrada ao vincular acionamento: especialidadeId={}", request.especialidadeId());
                    return new EntidadeNaoEncontradaException("Especialidade não encontrada: " + request.especialidadeId());
                });

        Funcionario plantonista = funcionarioRepository.findById(request.plantonistaId())
                .orElseThrow(() -> {
                    log.warn("Plantonista não encontrado ao vincular acionamento: plantonistaId={}", request.plantonistaId());
                    return new EntidadeNaoEncontradaException("Plantonista não encontrado: " + request.plantonistaId());
                });

        Funcionario usuarioResponsavel = funcionarioRepository.findById(request.usuarioResponsavelId())
                .orElseThrow(() -> {
                    log.warn("Usuário responsável não encontrado ao vincular acionamento: usuarioResponsavelId={}", request.usuarioResponsavelId());
                    return new EntidadeNaoEncontradaException("Usuário responsável não encontrado: " + request.usuarioResponsavelId());
                });

        chamado.setEspecialidade(especialidade);
        chamado.setPlantonista(plantonista);
        chamado.setUsuarioResponsavel(usuarioResponsavel);
    }
}