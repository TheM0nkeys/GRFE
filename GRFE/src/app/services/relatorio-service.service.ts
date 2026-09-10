import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RelatorioDados } from '../models/relatorio';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  // Mock temporário. Substitua o retorno por HttpClient quando a API estiver disponível.
  obterDados(): Observable<RelatorioDados> {
    return of({
      kpis: [
        { titulo: 'INCIDENTES ESTE MÊS', valor: '7', detalhe: '5 no mês anterior' },
        { titulo: 'SETOR CRÍTICO (AGO)', valor: 'Transmissão', detalhe: '2 ocorrências' },
        { titulo: 'INCIDENTES ESTA SEMANA', valor: '1', detalhe: 'Semana 35/2026' },
        { titulo: 'TAXA DE RESOLUÇÃO', valor: '87%', detalhe: 'de todos os incidentes' }
      ],
      tendenciaMensal: {
        labels: ['Jun', 'Jul', 'Ago'],
        criticos: [1, 1, 1],
        resolvidos: [3, 5, 5],
        total: [3, 5, 7]
      },
      incidentesPorSemana: {
        labels: ['S23', 'S25', 'S26', 'S27', 'S28', 'S29', 'S30', 'S31', 'S32', 'S33', 'S34', 'S35'],
        valores: [1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1]
      },
      incidentesPorSetor: {
        labels: ['Jun', 'Jul', 'Ago'],
        datasets: [
          { label: 'Geração', data: [0, 1, 1], backgroundColor: '#1f4275' },
          { label: 'Manutenção Elétrica', data: [0, 2, 0], backgroundColor: '#7b3fe4' },
          { label: 'Subestação', data: [1, 1, 0], backgroundColor: '#d97800' },
          { label: 'TI & Sistemas', data: [1, 0, 2], backgroundColor: '#2e63dc' },
          { label: 'Transmissão', data: [0, 0, 2], backgroundColor: '#009b73' }
        ]
      },
      sobreaviso: [
        { iniciais: 'CM', nome: 'Carlos Mendes', equipe: 'Alpha', setor: 'TI & Sistemas', totalPlantoes: 3, maiorSequencia: 1, alerta: 'Normal' },
        { iniciais: 'AR', nome: 'Ana Rodrigues', equipe: 'Beta', setor: 'Geração', totalPlantoes: 3, maiorSequencia: 1, alerta: 'Normal' },
        { iniciais: 'PS', nome: 'Pedro Souza', equipe: 'Alpha', setor: 'Transmissão', totalPlantoes: 3, maiorSequencia: 1, alerta: 'Normal' },
        { iniciais: 'FL', nome: 'Fernanda Lima', equipe: 'Gamma', setor: 'Manutenção Elétrica', totalPlantoes: 3, maiorSequencia: 1, alerta: 'Normal' },
        { iniciais: 'RT', nome: 'Rafael Torres', equipe: 'Delta', setor: 'Manutenção Mecânica', totalPlantoes: 3, maiorSequencia: 1, alerta: 'Normal' }
      ]
    });
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
      ['SOBREAVISO POR COLABORADOR', 'EQUIPE', 'SETOR', 'TOTAL DE PLANTÕES', 'MAIOR SEQUÊNCIA', 'ALERTA'].map((valor) => this.csvCell(valor)).join(';'),
      ...dados.sobreaviso.map((colaborador) => [colaborador.nome, colaborador.equipe, colaborador.setor, colaborador.totalPlantoes, colaborador.maiorSequencia, colaborador.alerta].map((valor) => this.csvCell(valor)).join(';'))
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