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
      setor: chamado.especialidadeNome ?? 'Sem setor',
      severidade: 'Sem severidade',
      responsavel: chamado.usuarioResponsavelNome ?? 'Sem responsável',
      usuarioResponsavelId: chamado.usuarioResponsavelId ?? null,
      data: this.safeDate(chamado.dataHoraAcionamento),
      especialidade: chamado.especialidadeNome ?? 'Sem especialidade',
      especialidadeId: chamado.especialidadeId ?? null,
      plantonista: chamado.plantonistaNome ?? 'Sem plantonista',
      plantonistaId: chamado.plantonistaId ?? null,
      motivo: chamado.motivo ?? '',
      descricao: chamado.motivo ?? '',
      status: this.statusApiResponse(chamado.status),
      updates: 0,
      atualizacoes: []
    };
  }

  private apiRequest(chamado: Partial<Chamado>): unknown {
    return {
      dataHoraAcionamento: chamado.data ? `${chamado.data}T00:00:00` : null,
      especialidadeId: this.resolveId(chamado.especialidadeId, chamado.especialidade),
      plantonistaId: this.resolveId(chamado.plantonistaId, chamado.plantonista),
      usuarioResponsavelId: this.resolveId(chamado.usuarioResponsavelId, chamado.responsavel),
      motivo: chamado.motivo ?? '',
      numeroIncidente: chamado.titulo ?? null,
      status: this.statusParaApi(chamado.status)
    };
  }

  private safeDate(value: string | Date | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value as string);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }

  private apiId(id: string): string {
    return id.replace(/^#/, '');
  }

  private resolveId(id: number | null | undefined, fallback: string | undefined): number | null {
    if (typeof id === 'number' && Number.isFinite(id) && id > 0) {
      return id;
    }

    if (typeof fallback === 'string') {
      const numero = Number(fallback);
      return Number.isFinite(numero) && numero > 0 ? numero : null;
    }

    return null;
  }

  private statusApiResponse(status: ChamadoResponse['status']): Chamado['status'] {
    if (status === 'ABERTO') return 'Aberto';
    if (status === 'EM_ANDAMENTO') return 'Em andamento';
    if (status === 'FECHADO') return 'Resolvido';
    return 'Sem status';
  }

  private statusParaApi(status: Chamado['status'] | undefined): ChamadoResponse['status'] {
    if (status === 'Aberto') return 'ABERTO';
    if (status === 'Em andamento') return 'EM_ANDAMENTO';
    return 'FECHADO';
  }
}
