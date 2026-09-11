package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.DivisaoRequest;
import br.com.itaipu.grfe.dto.response.DivisaoResponse;
import br.com.itaipu.grfe.entity.Divisao;
import br.com.itaipu.grfe.exception.EntidadeNaoEncontradaException;
import br.com.itaipu.grfe.repository.DivisaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class DivisaoService {

    private final DivisaoRepository divisaoRepository;

    public DivisaoService(DivisaoRepository divisaoRepository) {
        this.divisaoRepository = divisaoRepository;
    }

    public List<DivisaoResponse> listarTodas() {
        return divisaoRepository.findAll()
                .stream()
                .map(DivisaoResponse::fromEntity)
                .toList();
    }

    public DivisaoResponse buscarPorId(Long id) {
        Divisao divisao = buscarEntidadePorId(id);
        return DivisaoResponse.fromEntity(divisao);
    }

    @Transactional
    public DivisaoResponse criar(DivisaoRequest request) {
        Divisao divisao = request.toEntity();
        return DivisaoResponse.fromEntity(divisaoRepository.save(divisao));
    }

    @Transactional
    public DivisaoResponse atualizar(Long id, DivisaoRequest request) {
        Divisao divisao = buscarEntidadePorId(id);
        divisao.setNome(request.nome());
        return DivisaoResponse.fromEntity(divisaoRepository.save(divisao));
    }

    @Transactional
    public void deletar(Long id) {
        if (!divisaoRepository.existsById(id)) {
            throw new EntidadeNaoEncontradaException("Divisão não encontrada: " + id);
        }
        divisaoRepository.deleteById(id);
    }

    private Divisao buscarEntidadePorId(Long id) {
        return divisaoRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Divisão não encontrada: " + id));
    }
}
