package br.com.itaipu.grfe.config;

import br.com.itaipu.grfe.entity.*;
import br.com.itaipu.grfe.entity.enums.StatusChamado;
import br.com.itaipu.grfe.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final DivisaoRepository divisaoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final EspecialidadesRepository especialidadesRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final EscalaRepository escalaRepository;
    private final ChamadoRepository chamadoRepository;
    private final HistoricoAcionamentoRepository historicoRepository;

    public DatabaseSeeder(
            DivisaoRepository divisaoRepository,
            DepartamentoRepository departamentoRepository,
            EspecialidadesRepository especialidadesRepository,
            FuncionarioRepository funcionarioRepository,
            EscalaRepository escalaRepository,
            ChamadoRepository chamadoRepository,
            HistoricoAcionamentoRepository historicoRepository
    ) {
        this.divisaoRepository = divisaoRepository;
        this.departamentoRepository = departamentoRepository;
        this.especialidadesRepository = especialidadesRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.escalaRepository = escalaRepository;
        this.chamadoRepository = chamadoRepository;
        this.historicoRepository = historicoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        // Impede de cadastrar tudo novamente
        // toda vez que você iniciar o projeto
        if (divisaoRepository.count() > 0) {
            System.out.println("Banco já possui dados. Seeder ignorado.");
            return;
        }

        System.out.println("Iniciando Database Seeder...");

        // =========================
        // DIVISÃO
        // =========================

        Divisao divisao = new Divisao();
        divisao.setNome("Divisão de Tecnologia");

        divisao = divisaoRepository.save(divisao);


        // =========================
        // DEPARTAMENTO
        // =========================

        Departamento departamento = new Departamento();
        departamento.setNome("Departamento de Sistemas");
        departamento.setDivisao(divisao);

        departamento = departamentoRepository.save(departamento);


        // =========================
        // ESPECIALIDADE
        // =========================

        Especialidades especialidade = new Especialidades();
        especialidade.setNome("Desenvolvimento de Sistemas");
        especialidade.setDescricao(
                "Especialidade responsável pelos sistemas internos"
        );

        especialidade.setDivisao(divisao);
        especialidade.setDepartamento(departamento);

        especialidade = especialidadesRepository.save(especialidade);


        // =========================
        // FUNCIONÁRIO 1
        // =========================

        Funcionario funcionario1 = new Funcionario();
        funcionario1.setNome("Felipe Oliveira");
        funcionario1.setMatricula("100001");
        funcionario1.setEmail("felipe@itaipu.com.br");

        funcionario1.getEspecialidades().add(especialidade);

        funcionario1 = funcionarioRepository.save(funcionario1);


        // =========================
        // FUNCIONÁRIO 2
        // =========================

        Funcionario funcionario2 = new Funcionario();
        funcionario2.setNome("Pedro Moraes");
        funcionario2.setMatricula("100002");
        funcionario2.setEmail("pedro@itaipu.com.br");

        funcionario2.getEspecialidades().add(especialidade);

        funcionario2 = funcionarioRepository.save(funcionario2);


        // =========================
        // ESCALA
        // =========================

        Escala escala = new Escala();

        escala.setDataHoraInicio(
                LocalDateTime.now()
        );

        escala.setDataHoraFim(
                LocalDateTime.now().plusHours(8)
        );

        escala.setEspecialidade(especialidade);
        escala.setFuncionario(funcionario1);

        escalaRepository.save(escala);


        // =========================
        // CHAMADO
        // =========================

        Chamado chamado = new Chamado();

        chamado.setDataHoraAcionamento(
                LocalDateTime.now()
        );

        chamado.setEspecialidade(especialidade);

        chamado.setPlantonista(funcionario1);

        chamado.setUsuarioResponsavel(funcionario2);

        chamado.setMotivo(
                "Falha no sistema interno"
        );

        chamado.setNumeroIncidente("INC-001");

        chamado.setStatus(StatusChamado.ABERTO);

        chamado = chamadoRepository.save(chamado);


        // =========================
        // HISTÓRICO
        // =========================

        HistoricoAcionamento historico =
                new HistoricoAcionamento();

        historico.setDataHora(
                LocalDateTime.now()
        );

        historico.setAutor(funcionario2);

        historico.setComentario(
                "Chamado aberto e encaminhado para o plantonista."
        );

        historico.setChamado(chamado);

        historicoRepository.save(historico);


        System.out.println("Database Seeder executado com sucesso!");
    }
}