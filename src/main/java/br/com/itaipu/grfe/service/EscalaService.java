package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.EscalaRequest;
import br.com.itaipu.grfe.dto.response.EscalaResponse;
import br.com.itaipu.grfe.entity.Escala;
import br.com.itaipu.grfe.entity.Especialidades;
import br.com.itaipu.grfe.entity.Funcionario;
import br.com.itaipu.grfe.repository.EscalaRepository;
import br.com.itaipu.grfe.repository.EspecialidadesRepository;
import br.com.itaipu.grfe.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class EscalaService {

    private final EscalaRepository escalaRepository;
    private final EspecialidadesRepository especialidadesRepository;
    private final FuncionarioRepository funcionarioRepository;

    public EscalaService(EscalaRepository escalaRepository,
                         EspecialidadesRepository especialidadesRepository,
                         FuncionarioRepository funcionarioRepository) {
        this.escalaRepository = escalaRepository;
        this.especialidadesRepository = especialidadesRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<EscalaResponse> listarTodas() {
        return escalaRepository.findAll()
                .stream()
                .map(EscalaResponse::fromEntity)
                .toList();
    }

    public EscalaResponse buscarPorId(Long id) {
        return EscalaResponse.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public EscalaResponse criar(EscalaRequest request) {
        Escala escala = request.toEntity();
        vincularEspecialidadeEFuncionario(escala, request);
        return EscalaResponse.fromEntity(escalaRepository.save(escala));
    }

    @Transactional
    public EscalaResponse atualizar(Long id, EscalaRequest request) {
        Escala escala = buscarEntidadePorId(id);
        escala.setDataHoraInicio(request.dataHoraInicio());
        escala.setDataHoraFim(request.dataHoraFim());
        vincularEspecialidadeEFuncionario(escala, request);
        return EscalaResponse.fromEntity(escalaRepository.save(escala));
    }

    @Transactional
    public void deletar(Long id) {
        if (!escalaRepository.existsById(id)) {
            throw new IllegalArgumentException("Escala não encontrada: " + id);
        }
        escalaRepository.deleteById(id);
    }

    private Escala buscarEntidadePorId(Long id) {
        return escalaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Escala não encontrada: " + id));
    }

    private void vincularEspecialidadeEFuncionario(Escala escala, EscalaRequest request) {
        Especialidades especialidade = especialidadesRepository.findById(request.especialidadeId())
                .orElseThrow(() -> new IllegalArgumentException("Especialidade não encontrada: " + request.especialidadeId()));

        Funcionario funcionario = funcionarioRepository.findById(request.funcionarioId())
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado: " + request.funcionarioId()));

        escala.setEspecialidade(especialidade);
        escala.setFuncionario(funcionario);
    }
}