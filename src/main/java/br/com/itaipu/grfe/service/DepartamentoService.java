package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.DepartamentoRequest;
import br.com.itaipu.grfe.dto.response.DepartamentoResponse;
import br.com.itaipu.grfe.entity.Departamento;
import br.com.itaipu.grfe.entity.Divisao;
import br.com.itaipu.grfe.repository.DepartamentoRepository;
import br.com.itaipu.grfe.repository.DivisaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final DivisaoRepository divisaoRepository;

    public DepartamentoService(DepartamentoRepository departamentoRepository,
                               DivisaoRepository divisaoRepository) {
        this.departamentoRepository = departamentoRepository;
        this.divisaoRepository = divisaoRepository;
    }

    public List<DepartamentoResponse> listarTodos() {
        return departamentoRepository.findAll()
                .stream()
                .map(DepartamentoResponse::fromEntity)
                .toList();
    }

    public DepartamentoResponse buscarPorId(Long id) {
        return DepartamentoResponse.fromEntity(buscarEntidadePorId(id));
    }

    public DepartamentoResponse criar(DepartamentoRequest request) {
        Departamento departamento = request.toEntity();
        departamento.setDivisao(buscarDivisao(request.divisaoId()));
        return DepartamentoResponse.fromEntity(departamentoRepository.save(departamento));
    }

    public DepartamentoResponse atualizar(Long id, DepartamentoRequest request) {
        Departamento departamento = buscarEntidadePorId(id);
        departamento.setNome(request.nome());
        departamento.setDivisao(buscarDivisao(request.divisaoId()));
        return DepartamentoResponse.fromEntity(departamentoRepository.save(departamento));
    }

    public void deletar(Long id) {
        if (!departamentoRepository.existsById(id)) {
            throw new IllegalArgumentException("Departamento não encontrado: " + id);
        }
        departamentoRepository.deleteById(id);
    }

    private Departamento buscarEntidadePorId(Long id) {
        return departamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Departamento não encontrado: " + id));
    }

    private Divisao buscarDivisao(Long divisaoId) {
        return divisaoRepository.findById(divisaoId)
                .orElseThrow(() -> new IllegalArgumentException("Divisão não encontrada: " + divisaoId));
    }
}
