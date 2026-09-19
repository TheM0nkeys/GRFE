import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { RelatorioDados } from '../../../../models/relatorio';
import { RelatorioService } from '../../../../services/relatorio-service.service';

Chart.register(...registerables);

@Component({
  selector: 'app-relatorios-charts',
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorios-charts.component.html',
  styleUrl: './relatorios-charts.component.scss'
})
export class RelatoriosChartsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tendenciaChart') tendenciaChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('semanasChart') semanasChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('setoresChart') setoresChart?: ElementRef<HTMLCanvasElement>;

  dados?: RelatorioDados;
  carregando = true;
  erro = false;
  periodoSelecionado = 12;
  readonly periodos = [
    { valor: 3, label: 'Últimos 3 meses' },
    { valor: 6, label: 'Últimos 6 meses' },
    { valor: 12, label: 'Últimos 12 meses' },
    { valor: 0, label: 'Todo o período' }
  ];
  private charts: Chart[] = [];

  get anoGrafico(): string {
    return new Date().getFullYear().toString();
  }

  constructor(
    private readonly relatorioService: RelatorioService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.relatorioService.obterDados().subscribe({
      next: (dados) => {
        this.dados = dados;
        this.carregando = false;
        this.changeDetector.detectChanges();
        this.criarGraficos();
      },
      error: () => {
        this.carregando = false;
        this.erro = true;
        this.changeDetector.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.charts.forEach((chart) => chart.destroy());
  }

  atualizarPeriodo(): void {
    if (this.dados) {
      this.destruirGraficoTendencia();
      this.criarGraficoTendencia();
    }
  }

  private criarGraficos(): void {
    if (!this.dados || !this.tendenciaChart || !this.semanasChart || !this.setoresChart) {
      return;
    }

    const eixo: any = {
      color: '#687b96',
      border: { display: false },
      grid: { color: '#d7e1ef', borderDash: [3, 3] }
    };

    this.criarGraficoTendencia();
    this.charts = [
      ...this.charts,
      new Chart(this.semanasChart.nativeElement, {
        type: 'bar',
        data: { labels: this.dados.incidentesPorSemana.labels, datasets: [{ label: 'Incidentes', data: this.dados.incidentesPorSemana.valores, backgroundColor: '#244b82', borderRadius: 3, barPercentage: 0.78 }] },
        options: this.opcoesBarra(eixo)
      }),
      new Chart(this.setoresChart.nativeElement, {
        type: 'bar',
        data: { labels: this.dados.incidentesPorSetor.labels, datasets: this.dados.incidentesPorSetor.datasets.map((dataset) => ({ ...dataset, borderRadius: 0, barPercentage: 0.8 })) },
        options: { ...this.opcoesBarra(eixo), scales: { x: { ...eixo, stacked: true }, y: { ...eixo, stacked: true, beginAtZero: true } } }
      })
    ];
  }

  private criarGraficoTendencia(): void {
    if (!this.dados || !this.tendenciaChart) return;

    const eixo: any = {
      color: '#687b96',
      border: { display: false },
      grid: { color: '#d7e1ef', borderDash: [3, 3] }
    };
    const tendencia = this.periodoSelecionado
      ? {
          labels: this.dados.tendenciaMensal.labels.slice(-this.periodoSelecionado),
          criticos: this.dados.tendenciaMensal.criticos.slice(-this.periodoSelecionado),
          resolvidos: this.dados.tendenciaMensal.resolvidos.slice(-this.periodoSelecionado),
          total: this.dados.tendenciaMensal.total.slice(-this.periodoSelecionado)
        }
      : this.dados.tendenciaMensal;

    const chart = new Chart(this.tendenciaChart.nativeElement, {
        type: 'line',
        data: {
          labels: tendencia.labels,
          datasets: [
            { label: 'Críticos', data: tendencia.criticos, borderColor: '#df4d3f', backgroundColor: '#df4d3f', pointBackgroundColor: '#fff', pointBorderWidth: 2, tension: 0, borderWidth: 2 },
            { label: 'Resolvidos', data: tendencia.resolvidos, borderColor: '#08a47d', backgroundColor: '#08a47d', pointBackgroundColor: '#fff', pointBorderWidth: 2, tension: 0, borderWidth: 2 },
            { label: 'Total', data: tendencia.total, borderColor: '#244b82', backgroundColor: '#244b82', pointBackgroundColor: '#fff', pointBorderWidth: 2, tension: 0, borderWidth: 2 }
          ]
        },
        options: this.opcoesLinha(eixo)
      });
    this.charts.unshift(chart);
  }

  private destruirGraficoTendencia(): void {
    const chart = this.charts.shift();
    chart?.destroy();
  }

  private opcoesLinha(eixo: any): any {
    return { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 6, padding: 18, color: '#31527d' } } }, scales: { x: eixo, y: { ...eixo, beginAtZero: true, ticks: { stepSize: 2 } } } };
  }

  private opcoesBarra(eixo: any): any {
    return { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: eixo, y: { ...eixo, beginAtZero: true, ticks: { stepSize: 1 } } } };
  }
}
