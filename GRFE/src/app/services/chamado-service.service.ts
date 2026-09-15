import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Chamado, ChamadoResponse } from '../models/chamado';
import { HistoricoAcionamentoResponse } from '../models/historicos';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {

  private readonly apiUrl = '/api/chamados';

  constructor(private readonly http: HttpClient) {}


  obterChamados(): Observable<Chamado[]> {
    return this.http.get<ChamadoResponse[]>(this.apiUrl).pipe(
      map((chamados) => chamados.map((chamado) => this.apiResponse(chamado)))
    );
  }

  obterChamado(id: string): Observable<Chamado | undefined> {
    return this.http.get<ChamadoResponse>(`${this.apiUrl}/${this.apiId(id)}`).pipe(
      map((chamado) => this.apiResponse(chamado))
    );
  }

  criarChamado(dados: Omit<Chamado, 'id' | 'atualizacoes' | 'updates'>): Observable<Chamado> {
    return this.http.post<ChamadoResponse>(this.apiUrl, this.apiRequest(dados)).pipe(
      map((chamado) => this.apiResponse(chamado))
    );
  }

  atualizarChamado(chamadoAtualizado: Chamado): Observable<Chamado> {
    return this.http.put<ChamadoResponse>(`${this.apiUrl}/${this.apiId(chamadoAtualizado.id)}`, this.apiRequest(chamadoAtualizado)).pipe(
      map((chamado) => this.apiResponse(chamado))
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

  private apiResponse(chamado: ChamadoResponse): Chamado {
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
      status: this.statusApiResponse(chamado.status),
      updates: 0,
      atualizacoes: []
    };
  }

  private apiRequest(chamado: Partial<Chamado>): unknown {
    return {
      dataHoraAcionamento: `${chamado.data}T00:00:00`,
      especialidadeId: this.numId(chamado.especialidade),
      plantonistaId: this.numId(chamado.plantonista),
      usuarioResponsavelId: this.numId(chamado.responsavel),
      motivo: chamado.motivo,
      numeroIncidente: chamado.titulo,
      status: this.statusParaApi(chamado.status)
    };
  }

  private apiId(id: string): string {
    return id.replace(/^#/, '');
  }

  private numId(value: string | undefined): number | null {
    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  private statusApiResponse(status: ChamadoResponse['status']): Chamado['status'] {
    return status === 'ABERTO' ? 'Aberto' : status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Resolvido';
  }

  private statusParaApi(status: Chamado['status'] | undefined): ChamadoResponse['status'] {
    return status === 'Aberto' ? 'ABERTO' : status === 'Em andamento' ? 'EM_ANDAMENTO' : 'FECHADO';
  }
}
