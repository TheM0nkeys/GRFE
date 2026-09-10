package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.ChamadoRequest;
import br.com.itaipu.grfe.dto.response.ChamadoResponse;
import br.com.itaipu.grfe.entity.Chamado;
import br.com.itaipu.grfe.entity.Especialidades;
import br.com.itaipu.grfe.entity.Funcionario;
import br.com.itaipu.grfe.repository.ChamadoRepository;
import br.com.itaipu.grfe.repository.EspecialidadesRepository;
import br.com.itaipu.grfe.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ChamadoService {

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

    public ChamadoResponse buscarPorId(Long id) {
        return ChamadoResponse.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public ChamadoResponse criar(ChamadoRequest request) {
        Chamado chamado = request.toEntity();
        vincularRelacoes(chamado, request);
        return ChamadoResponse.fromEntity(chamadoRepository.save(chamado));
    }

    @Transactional
    public ChamadoResponse atualizar(Long id, ChamadoRequest request) {
        Chamado chamado = buscarEntidadePorId(id);
        chamado.setDataHoraAcionamento(request.dataHoraAcionamento());
        chamado.setMotivo(request.motivo());
        chamado.setNumeroIncidente(request.numeroIncidente());
        chamado.setStatus(request.status());
        vincularRelacoes(chamado, request);
        return ChamadoResponse.fromEntity(chamadoRepository.save(chamado));
    }

    @Transactional
    public void deletar(Long id) {
        if (!chamadoRepository.existsById(id)) {
            throw new IllegalArgumentException("Acionamento não encontrado: " + id);
        }
        chamadoRepository.deleteById(id);
    }

    private Chamado buscarEntidadePorId(Long id) {
        return chamadoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Acionamento não encontrado: " + id));
    }

    private void vincularRelacoes(Chamado chamado, ChamadoRequest request) {
        Especialidades especialidade = especialidadesRepository.findById(request.especialidadeId())
                .orElseThrow(() -> new IllegalArgumentException("Especialidade não encontrada: " + request.especialidadeId()));

        Funcionario plantonista = funcionarioRepository.findById(request.plantonistaId())
                .orElseThrow(() -> new IllegalArgumentException("Plantonista não encontrado: " + request.plantonistaId()));

        Funcionario usuarioResponsavel = funcionarioRepository.findById(request.usuarioResponsavelId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário responsável não encontrado: " + request.usuarioResponsavelId()));

        chamado.setEspecialidade(especialidade);
        chamado.setPlantonista(plantonista);
        chamado.setUsuarioResponsavel(usuarioResponsavel);
    }
}