package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.EspecialidadesRequest;
import br.com.itaipu.grfe.dto.response.EspecialidadeResponse;
import br.com.itaipu.grfe.entity.Departamento;
import br.com.itaipu.grfe.entity.Divisao;
import br.com.itaipu.grfe.entity.Especialidades;
import br.com.itaipu.grfe.exception.EntidadeNaoEncontradaException;
import br.com.itaipu.grfe.repository.DepartamentoRepository;
import br.com.itaipu.grfe.repository.DivisaoRepository;
import br.com.itaipu.grfe.repository.EspecialidadesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class EspecialidadesService {

    private final EspecialidadesRepository especialidadesRepository;
    private final DivisaoRepository divisaoRepository;
    private final DepartamentoRepository departamentoRepository;

    public EspecialidadesService(EspecialidadesRepository especialidadesRepository,
                                 DivisaoRepository divisaoRepository,
                                 DepartamentoRepository departamentoRepository) {
        this.especialidadesRepository = especialidadesRepository;
        this.divisaoRepository = divisaoRepository;
        this.departamentoRepository = departamentoRepository;
    }

    public List<EspecialidadeResponse> listarTodas() {
        return especialidadesRepository.findAll()
                .stream()
                .map(EspecialidadeResponse::fromEntity)
                .toList();
    }

    public EspecialidadeResponse buscarPorId(Long id) {
        return EspecialidadeResponse.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public EspecialidadeResponse criar(EspecialidadesRequest request) {
        Especialidades especialidade = request.toEntity();
        vincularDivisaoEDepartamento(especialidade, request);
        return EspecialidadeResponse.fromEntity(especialidadesRepository.save(especialidade));
    }

    @Transactional
    public EspecialidadeResponse atualizar(Long id, EspecialidadesRequest request) {
        Especialidades especialidade = buscarEntidadePorId(id);
        especialidade.setNome(request.nome());
        especialidade.setDescricao(request.descricao());
        vincularDivisaoEDepartamento(especialidade, request);
        return EspecialidadeResponse.fromEntity(especialidadesRepository.save(especialidade));
    }

    @Transactional
    public void deletar(Long id) {
        if (!especialidadesRepository.existsById(id)) {
            throw new EntidadeNaoEncontradaException("Especialidade não encontrada: " + id);
        }
        especialidadesRepository.deleteById(id);
    }

    private Especialidades buscarEntidadePorId(Long id) {
        return especialidadesRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Especialidade não encontrada: " + id));
    }

    private void vincularDivisaoEDepartamento(Especialidades especialidade, EspecialidadesRequest request) {
        Divisao divisao = divisaoRepository.findById(request.divisaoId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Divisão não encontrada: " + request.divisaoId()));

        Departamento departamento = departamentoRepository.findById(request.departamentoId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Departamento não encontrado: " + request.departamentoId()));

        if (!departamento.getDivisao().getId().equals(divisao.getId())) {
            throw new IllegalArgumentException(
                    "O departamento informado (" + departamento.getNome() +
                            ") não pertence à divisão informada (" + divisao.getNome() + ")");
        }

        especialidade.setDivisao(divisao);
        especialidade.setDepartamento(departamento);
    }
}
