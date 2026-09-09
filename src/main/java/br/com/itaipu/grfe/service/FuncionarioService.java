package br.com.itaipu.grfe.service;

import br.com.itaipu.grfe.dto.request.FuncionarioRequest;
import br.com.itaipu.grfe.dto.response.FuncionarioResponse;
import br.com.itaipu.grfe.entity.Especialidades;
import br.com.itaipu.grfe.entity.Funcionario;
import br.com.itaipu.grfe.repository.EspecialidadesRepository;
import br.com.itaipu.grfe.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final EspecialidadesRepository especialidadesRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository,
                              EspecialidadesRepository especialidadesRepository) {
        this.funcionarioRepository = funcionarioRepository;
        this.especialidadesRepository = especialidadesRepository;
    }

    public List<FuncionarioResponse> listarTodos() {
        return funcionarioRepository.findAll()
                .stream()
                .map(FuncionarioResponse::fromEntity)
                .toList();
    }

    public FuncionarioResponse buscarPorId(Long id) {
        return FuncionarioResponse.fromEntity(buscarEntidadePorId(id));
    }

    public FuncionarioResponse criar(FuncionarioRequest request) {
        Funcionario funcionario = request.toEntity();
        funcionario.setEspecialidades(buscarEspecialidades(request.especialidadeIds()));
        return FuncionarioResponse.fromEntity(funcionarioRepository.save(funcionario));
    }

    public FuncionarioResponse atualizar(Long id, FuncionarioRequest request) {
        Funcionario funcionario = buscarEntidadePorId(id);
        funcionario.setNome(request.nome());
        funcionario.setMatricula(request.matricula());
        funcionario.setEmail(request.email());
        funcionario.setEspecialidades(buscarEspecialidades(request.especialidadeIds()));
        return FuncionarioResponse.fromEntity(funcionarioRepository.save(funcionario));
    }

    public void deletar(Long id) {
        if (!funcionarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Funcionário não encontrado: " + id);
        }
        funcionarioRepository.deleteById(id);
    }

    private Funcionario buscarEntidadePorId(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado: " + id));
    }

    private Set<Especialidades> buscarEspecialidades(Set<Long> ids) {
        Set<Especialidades> especialidades = new HashSet<>(especialidadesRepository.findAllById(ids));
        if (especialidades.size() != ids.size()) {
            throw new IllegalArgumentException("Uma ou mais especialidades informadas não existem");
        }
        return especialidades;
    }
}