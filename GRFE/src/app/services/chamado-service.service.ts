import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Chamado, ChamadoResponse } from '../models/chamado';
import { HistoricoAcionamentoResponse } from '../models/historicos';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {

  private readonly apiUrl = 'http://localhost:8080/chamados';

  constructor(private readonly http: HttpClient) {}

  // Dados fictícios (mock)
  private readonly mockChamados: Chamado[] = [
    {
      id: '#1001',
      titulo: 'Falha no transformador T-07',
      setor: 'Transmissão',
      severidade: 'Crítica',
      responsavel: 'Pedro',
      data: '2026-08-16',
      especialidade: 'STORAGE',
      plantonista: 'Roberto Silva',
      motivo: 'Queda de comunicação com o transformador T-07.',
      descricao: 'O monitoramento identificou perda de comunicação e aquecimento acima do limite operacional no transformador T-07.',
      status: 'Resolvido',
      updates: 3,
      atualizacoes: [{ autor: 'Pedro', dataHora: '16/08/2026 14:30', texto: 'Equipamento normalizado após intervenção da equipe de transmissão.' }]
    },
    {
      id: '#1002',
      titulo: 'Oscilação de tensão na unidade 3',
      setor: 'Geração',
      severidade: 'Alta',
      responsavel: 'Ana',
      data: '2026-08-09',
      especialidade: 'DBA',
      plantonista: 'Carlos Eduardo',
      motivo: 'Oscilação de tensão registrada durante o pico de carga.',
      descricao: 'A unidade 3 apresentou oscilações intermitentes durante a operação de pico. A equipe de geração acompanha os parâmetros.',
      status: 'Resolvido',
      updates: 2,
      atualizacoes: [{ autor: 'Ana', dataHora: '09/08/2026 18:20', texto: 'Parâmetros estabilizados e unidade liberada para operação.' }]
    },
    {
      id: '#1003',
      titulo: 'Alarme de intrusão - Setor Norte',
      setor: 'Segurança',
      severidade: 'Média',
      responsavel: 'Marcos',
      data: '2026-08-10',
      especialidade: 'INFRA',
      plantonista: 'Roberto Silva',
      motivo: 'Alarme disparado na área externa do setor norte.',
      descricao: 'O sensor perimetral registrou movimentação fora do horário previsto. A segurança realizou a verificação no local.',
      status: 'Resolvido',
      updates: 1,
      atualizacoes: [{ autor: 'Marcos', dataHora: '10/08/2026 02:10', texto: 'Inspeção concluída sem evidência de acesso indevido.' }]
    },
    {
      id: '#1004',
      titulo: 'Falha no sistema SCADA',
      setor: 'TI & Sistemas',
      severidade: 'Alta',
      responsavel: 'Carlos',
      data: '2026-08-02',
      especialidade: 'REDES',
      plantonista: 'Fernando Alves',
      motivo: 'Indisponibilidade temporária da interface principal do SCADA.',
      descricao: 'A interface de supervisão ficou indisponível para os operadores. O time de TI atua na análise dos logs do serviço.',
      status: 'Em andamento',
      updates: 4,
      atualizacoes: [{ autor: 'Carlos', dataHora: '02/08/2026 09:15', texto: 'Serviço reiniciado; investigação da causa raiz em andamento.' }]
    },
    {
      id: '#1005',
      titulo: 'Vibração anormal na turbina 5',
      setor: 'Manutenção Mecânica',
      severidade: 'Alta',
      responsavel: 'Rafael',
      data: '2026-08-23',
      especialidade: 'SEC',
      plantonista: 'Diego Carvalho',
      motivo: 'Vibração acima do padrão na turbina durante inspeção.',
      descricao: 'A manutenção identificou vibração acima do padrão recomendado e iniciou a inspeção preventiva da turbina 5.',
      status: 'Em andamento',
      updates: 3,
      atualizacoes: [{ autor: 'Rafael', dataHora: '23/08/2026 11:40', texto: 'Equipe mecânica deslocada para inspeção detalhada.' }]
    },
    {
      id: '#1006',
      titulo: 'Disjuntor 220kV fora de operação',
      setor: 'Subestação',
      severidade: 'Crítica',
      responsavel: 'Juliana',
      data: '2026-07-27',
      especialidade: 'SAP',
      plantonista: 'Thiago Nascimento',
      motivo: 'Disjuntor apresentou falha no comando remoto.',
      descricao: 'A equipe de subestação isolou o equipamento e iniciou o procedimento de manutenção corretiva.',
      status: 'Resolvido',
      updates: 5,
      atualizacoes: [{ autor: 'Juliana', dataHora: '27/07/2026 16:05', texto: 'Comando remoto restabelecido após troca do módulo de controle.' }]
    }
  ];

  obterChamados(): Observable<Chamado[]> {
    return this.http.get<ChamadoResponse[]>(this.apiUrl).pipe(
      map((chamados) => chamados.map((chamado) => this.fromApi(chamado)))
    );
  }

  obterChamado(id: string): Observable<Chamado | undefined> {
    return this.http.get<ChamadoResponse>(`${this.apiUrl}/${this.apiId(id)}`).pipe(
      map((chamado) => this.fromApi(chamado))
    );
  }

  criarChamado(dados: Omit<Chamado, 'id' | 'atualizacoes' | 'updates'>): Observable<Chamado> {
    return this.http.post<ChamadoResponse>(this.apiUrl, this.toApiRequest(dados)).pipe(
      map((chamado) => this.fromApi(chamado))
    );
  }

  atualizarChamado(chamadoAtualizado: Chamado): Observable<Chamado> {
    return this.http.put<ChamadoResponse>(`${this.apiUrl}/${this.apiId(chamadoAtualizado.id)}`, this.toApiRequest(chamadoAtualizado)).pipe(
      map((chamado) => this.fromApi(chamado))
    );
  }

  obterHistorico(id: string): Observable<Chamado['atualizacoes']> {
    return this.http.get<HistoricoAcionamentoResponse[]>(`${this.apiUrl}/${this.apiId(id)}/historico`).pipe(
      map((historico) => historico.map((item) => ({
        autor: item.autorNome,
        dataHora: item.dataHora,
        texto: item.comentario
      })))
    );
  }

  private fromApi(chamado: ChamadoResponse): Chamado {
    return {
      id: String(chamado.id),
      titulo: chamado.numeroIncidente || `Chamado ${chamado.id}`,
      setor: '',
      severidade: 'Média',
      responsavel: chamado.usuarioResponsavelNome,
      data: chamado.dataHoraAcionamento.slice(0, 10),
      especialidade: chamado.especialidadeNome,
      plantonista: chamado.plantonistaNome,
      motivo: chamado.motivo,
      descricao: chamado.motivo,
      status: this.statusFromApi(chamado.status),
      updates: 0,
      atualizacoes: []
    };
  }

  private toApiRequest(chamado: Partial<Chamado>): unknown {
    return {
      dataHoraAcionamento: `${chamado.data}T00:00:00`,
      especialidadeId: this.numericId(chamado.especialidade),
      plantonistaId: this.numericId(chamado.plantonista),
      usuarioResponsavelId: this.numericId(chamado.responsavel),
      motivo: chamado.motivo,
      numeroIncidente: chamado.titulo,
      status: this.statusToApi(chamado.status)
    };
  }

  private apiId(id: string): string {
    return id.replace(/^#/, '');
  }

  private numericId(value: string | undefined): number | null {
    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  private statusFromApi(status: ChamadoResponse['status']): Chamado['status'] {
    return status === 'ABERTO' ? 'Aberto' : status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Resolvido';
  }

  private statusToApi(status: Chamado['status'] | undefined): ChamadoResponse['status'] {
    return status === 'Aberto' ? 'ABERTO' : status === 'Em andamento' ? 'EM_ANDAMENTO' : 'FECHADO';
  }
}
