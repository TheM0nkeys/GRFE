import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChamadoService } from './chamado-service.service';
import { RelatorioDados } from '../models/relatorio';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  constructor(private readonly chamadoService: ChamadoService) {}

  obterDados(): Observable<RelatorioDados> {
    return this.chamadoService.obterChamados().pipe(map((chamados) => {
      const total = chamados.length;
      const resolvidos = chamados.filter((chamado) => chamado.status === 'Resolvido').length;
      const porSetor = this.contar(chamados.map((chamado) => chamado.setor || 'Sem setor'));
      const setorCritico = [...porSetor.entries()].sort((a, b) => b[1] - a[1])[0];
      const meses = [...new Set(chamados.map((chamado) => chamado.data.slice(0, 7)))].sort();
      const labels = meses.length ? meses : [this.mesAtual()];

      return {
        kpis: [
          { titulo: 'INCIDENTES ESTE MÊS', valor: String(chamados.filter((chamado) => chamado.data.slice(0, 7) === this.mesAtual()).length), detalhe: `${total} no total` },
          { titulo: 'SETOR CRÍTICO', valor: setorCritico?.[0] || 'Sem dados', detalhe: `${setorCritico?.[1] || 0} ocorrências` },
          { titulo: 'INCIDENTES ESTA SEMANA', valor: String(chamados.filter((chamado) => this.naSemanaAtual(chamado.data)).length), detalhe: 'período atual' },
          { titulo: 'TAXA DE RESOLUÇÃO', valor: `${total ? Math.round(resolvidos / total * 100) : 0}%`, detalhe: 'dos incidentes' }
        ],
        tendenciaMensal: {
          labels: labels.map((mes) => mes.slice(5)),
          criticos: labels.map((mes) => chamados.filter((chamado) => chamado.data.startsWith(mes) && chamado.severidade === 'Crítica').length),
          resolvidos: labels.map((mes) => chamados.filter((chamado) => chamado.data.startsWith(mes) && chamado.status === 'Resolvido').length),
          total: labels.map((mes) => chamados.filter((chamado) => chamado.data.startsWith(mes)).length)
        },
        incidentesPorSemana: this.agruparPorSemana(chamados),
        incidentesPorSetor: {
          labels: [...porSetor.keys()],
          datasets: [{ label: 'Incidentes', data: [...porSetor.values()], backgroundColor: '#244b82' }]
        },
        sobreaviso: []
      };
    }));
  }

  private contar(valores: string[]): Map<string, number> {
    return valores.reduce((totais, valor) => totais.set(valor, (totais.get(valor) ?? 0) + 1), new Map<string, number>());
  }

  private agruparPorSemana(chamados: import('../models/chamado').Chamado[]): { labels: string[]; valores: number[] } {
    const semanas = this.contar(chamados.map((chamado) => `S${this.semanaDoAno(chamado.data)}`));
    return { labels: [...semanas.keys()], valores: [...semanas.values()] };
  }

  private semanaDoAno(data: string): number {
    const inicio = new Date(new Date(data).getFullYear(), 0, 1);
    return Math.ceil((((new Date(data).getTime() - inicio.getTime()) / 86400000) + inicio.getDay() + 1) / 7);
  }

  private mesAtual(): string {
    return new Date().toISOString().slice(0, 7);
  }

  private naSemanaAtual(data: string): boolean {
    const hoje = new Date();
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - hoje.getDay());
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 7);
    const dataChamado = new Date(`${data}T00:00:00`);
    return dataChamado >= inicio && dataChamado < fim;
  }

  gerarCsv(dados: RelatorioDados): void {
    const linhas: string[] = [
      ['RELATÓRIO DE INCIDENTES'].join(';'),
      ['INDICADOR', 'VALOR', 'DETALHE'].map((valor) => this.csvCell(valor)).join(';'),
      ...dados.kpis.map((kpi) => [kpi.titulo, kpi.valor, kpi.detalhe].map((valor) => this.csvCell(valor)).join(';')),
      '',
      ['TENDÊNCIA MENSAL', 'CRÍTICOS', 'RESOLVIDOS', 'TOTAL'].map((valor) => this.csvCell(valor)).join(';'),
      ...dados.tendenciaMensal.labels.map((mes, index) => [mes, dados.tendenciaMensal.criticos[index], dados.tendenciaMensal.resolvidos[index], dados.tendenciaMensal.total[index]].map((valor) => this.csvCell(valor)).join(';')),
      '',
      ['INCIDENTES POR SEMANA', 'TOTAL'].map((valor) => this.csvCell(valor)).join(';'),
      ...dados.incidentesPorSemana.labels.map((semana, index) => [semana, dados.incidentesPorSemana.valores[index]].map((valor) => this.csvCell(valor)).join(';')),
      '',
      ['SOBREAVISO POR COLABORADOR', 'SETOR', 'TOTAL DE PLANTÕES', 'MAIOR SEQUÊNCIA', 'ALERTA'].map((valor) => this.csvCell(valor)).join(';'),
      ...dados.sobreaviso.map((colaborador) => [colaborador.nome, colaborador.setor, colaborador.totalPlantoes, colaborador.maiorSequencia, colaborador.alerta].map((valor) => this.csvCell(valor)).join(';'))
    ];

    const blob = new Blob(['\ufeff' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-incidentes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private csvCell(valor: unknown): string {
    return `"${String(valor ?? '').replace(/"/g, '""')}"`;
  }
}
